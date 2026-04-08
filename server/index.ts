import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import passport from './auth';
import authRouter from './routes/auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required in production');
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session
const MStore = MemoryStore(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    store: new MStore({ checkPeriod: 86400000 }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api/auth', authRouter);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.resolve(__dirname, '../public');
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});