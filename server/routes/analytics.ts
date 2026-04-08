import { Router } from 'express';
import { db } from '../db.js';
import { analyticsSnapshots } from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Twitter/X'];

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const snapshots = await db
      .select()
      .from(analyticsSnapshots)
      .where(eq(analyticsSnapshots.userId, req.session.userId!))
      .orderBy(desc(analyticsSnapshots.capturedAt));

    const latest: Record<string, typeof snapshots[0]> = {};
    for (const snap of snapshots) {
      if (snap.platform && !latest[snap.platform]) {
        latest[snap.platform] = snap;
      }
    }

    const result = PLATFORMS.map((platform) =>
      latest[platform] || { platform, views: 0, likes: 0, comments: 0 }
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
