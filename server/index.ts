import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import platformsRouter from './routes/platforms.js';
import vaultRouter from './routes/vault.js';
import postsRouter from './routes/posts.js';
import plannerRouter from './routes/planner.js';
import analyticsRouter from './routes/analytics.js';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT || 5000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const SESSION_SECRET = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !SESSION_SECRET) {
  console.error('SESSION_SECRET environment variable is required in production');
  process.exit(1);
}

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

if (isProduction) {
  app.set('trust proxy', 1);
}

const MemStore = MemoryStore(session);

app.use(
  session({
    store: new MemStore({ checkPeriod: 86400000 }),
    secret: SESSION_SECRET || 'dev-secret',
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

// CSRF/origin protection for mutating requests in production
if (isProduction) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!mutating.includes(req.method)) return next();
    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    const validOrigin = origin === FRONTEND_URL;
    const validReferer = !origin && referer && new URL(referer).origin === FRONTEND_URL;
    if (!validOrigin && !validReferer) {
      return res.status(403).json({ error: 'Forbidden: invalid origin' });
    }
    next();
  });
}

// Mount auth routes
app.use('/api/auth', authRouter);
app.use('/api/platforms', platformsRouter);
app.use('/api/vault', vaultRouter);
app.use('/api/posts', postsRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/analytics', analyticsRouter);

// Serve static frontend in production
if (isProduction) {
  const staticPath = path.resolve(__dirname, '../../dist/public');
  app.use(express.static(staticPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});

export default app;
