import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import passport from '../auth.js';
import { hashPassword } from '../auth.js';
import { createUser, getUserByEmail, getUserByUsername } from '../storage.js';
import type { User } from '../../shared/schema.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// POST /api/auth/register
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required.' });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, email, passwordHash });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login after registration failed.' });
      }
      const { passwordHash: _, ...safeUser } = user;
      return res.status(201).json(safeUser);
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error | null, user: User | false, info: { message: string }) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message ?? 'Authentication failed.' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      const { passwordHash: _, ...safeUser } = user;
      return res.json(safeUser);
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully.' });
  });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  const { passwordHash: _, ...safeUser } = req.user as User;
  res.json(safeUser);
});

export default router;