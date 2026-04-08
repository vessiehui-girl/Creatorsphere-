import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { db } from '../db';
import { users } from '../../shared/schema';
import { hashPassword } from '../auth';
import { eq } from 'drizzle-orm';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

// Register route
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(users).values({ email, passwordHash }).returning();
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login after register failed' });
      return res.status(201).json({ id: user.id, email: user.email });
    });
  } catch {
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

// Login route
router.post('/login', authLimiter, (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error | null, user: Express.User | false, info: { message?: string } | undefined) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message ?? 'Invalid credentials' });
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      const u = user as { id: number; email: string };
      return res.json({ id: u.id, email: u.email });
    });
  })(req, res, next);
});

// Logout route
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});

// /me endpoint
router.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const user = req.user as { id: number; email: string };
  return res.json({ id: user.id, email: user.email });
});

export default router;