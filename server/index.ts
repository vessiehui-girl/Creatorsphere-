import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from './auth.js';
import routes from './routes.js';
import { pool } from './db.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5000';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'creatorsphere-dev-secret-change-in-production';

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Session store backed by PostgreSQL
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  }),
);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});