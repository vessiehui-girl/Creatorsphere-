import { Router } from 'express';
import authRoutes from './routes/auth.js';
import platformRoutes from './routes/platforms.js';
import vaultRoutes from './routes/vault.js';
import postRoutes from './routes/posts.js';
import plannerRoutes from './routes/planner.js';
import analyticsRoutes from './routes/analytics.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/platforms', platformRoutes);
router.use('/vault', vaultRoutes);
router.use('/posts', postRoutes);
router.use('/planner', plannerRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
