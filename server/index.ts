import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
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
app.use(express.json());

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET environment variable is required in production');
  process.exit(1);
}

const MemStore = MemoryStore(session);

app.use(
  session({
    store: new MemStore({ checkPeriod: 86400000 }),
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/api/auth', authRouter);
app.use('/api/platforms', platformsRouter);
app.use('/api/vault', vaultRouter);
app.use('/api/posts', postsRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/analytics', analyticsRouter);

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.resolve(__dirname, '../../dist/public');
  app.use(express.static(staticPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
