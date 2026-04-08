import { Router, Request, Response } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { getAnalyticsByUserId } from '../storage.js';
import type { User } from '../../shared/schema.js';

const router = Router();

// GET /api/analytics/summary
router.get('/summary', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const snapshots = await getAnalyticsByUserId(userId);

    // Aggregate latest snapshot per platform
    const latestByPlatform: Record<string, (typeof snapshots)[0]> = {};
    for (const snapshot of snapshots) {
      if (!latestByPlatform[snapshot.platform]) {
        latestByPlatform[snapshot.platform] = snapshot;
      }
    }

    const summary = {
      totalFollowers: Object.values(latestByPlatform).reduce((sum, s) => sum + (s.followers ?? 0), 0),
      totalViews: Object.values(latestByPlatform).reduce((sum, s) => sum + (s.views ?? 0), 0),
      totalLikes: Object.values(latestByPlatform).reduce((sum, s) => sum + (s.likes ?? 0), 0),
      platforms: latestByPlatform,
      snapshots,
    };

    res.json(summary);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics.' });
  }
});

export default router;
