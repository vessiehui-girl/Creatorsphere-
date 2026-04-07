import { Router } from 'express';
import { db } from '../db.js';
import { scheduledPosts } from '../../shared/schema.js';
import { eq, asc } from 'drizzle-orm';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const items = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.userId, req.session.userId!))
      .orderBy(asc(scheduledPosts.scheduledFor));
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/schedule', requireAuth, async (req, res) => {
  try {
    const { postId, platform, scheduledFor } = req.body;
    if (!postId || !platform || !scheduledFor) {
      return res.status(400).json({ message: 'postId, platform, and scheduledFor are required' });
    }
    const [scheduled] = await db
      .insert(scheduledPosts)
      .values({
        userId: req.session.userId!,
        postId,
        platform,
        scheduledFor: new Date(scheduledFor),
        status: 'pending',
      })
      .returning();
    return res.status(201).json(scheduled);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
