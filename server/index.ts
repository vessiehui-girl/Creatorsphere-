import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import authRoutes from './routes/auth';
const app = express();
const PORT = process.env.PORT || 5000;
// PostgreSQL connection pool for sessions
const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Connect-pg-simple session store
const PgSession = connectPgSimple(session);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Session configuration with PostgreSQL store
app.use(
    session({
        store: new PgSession({
            pool: pgPool,
            tableName: 'user_sessions',
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET || 'dev-secret-change-this',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    })
);
// Passport LocalStrategy configuration
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                return done(null, { id: user.id, email: user.email });
            } catch (error) {
                return done(error);
            }
        }
    )
);
// Passport serialization
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
        });
        if (!user) {
            return done(null, false);
        }
        done(null, { id: user.id, email: user.email });
    } catch (error) {
        done(error);
    }
});
// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
// Mount auth routes
app.use('/api/auth', authRoutes);
// Protected route example
app.get('/api/protected', (req, res) => {
    const userId = (req as any).session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    return res.status(200).json({ message: 'This is a protected route', userId, });
});
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔐 Session store: PostgreSQL (production-ready)`);
    console.log(`🗄️  Database: Connected to ${process.env.DATABASE_URL?.split('@')[1] || 'unknown'}`);
});
export default app;