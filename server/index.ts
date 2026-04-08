import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { authRouter } from './routes/auth.js';
import { pool } from './db.js';

const app = express();

const PORT = Number(process.env.PORT || 5000);
const FRONTEND_URL = process.env.FRONTEND_URL;
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

if (!FRONTEND_URL) throw new Error('Missing FRONTEND_URL');
if (!DATABASE_URL) throw new Error('Missing DATABASE_URL');
if (!SESSION_SECRET) throw new Error('Missing SESSION_SECRET');

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

const PoolStore = pgSession(session);

app.use(
  session({
    store: new PoolStore({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// CSRF/origin protection for mutating requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!mutating.includes(req.method)) {
    return next();
  }
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const allowed = FRONTEND_URL as string;
  const validOrigin = origin === allowed;
  const validReferer = !origin && referer && new URL(referer).origin === allowed;
  if (!validOrigin && !validReferer) {
    return res.status(403).json({ error: 'Forbidden: invalid origin' });
  }
  next();
});

// Mount auth routes
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});