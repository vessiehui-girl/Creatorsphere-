import { Router, Request, Response } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getScheduledPostsByUserId,
  getScheduledPostById,
  createScheduledPost,
  deleteScheduledPost,
  getPostById,
} from '../storage.js';
import type { User } from '../../shared/schema.js';

const router = Router();

// GET /api/planner
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const scheduled = await getScheduledPostsByUserId(userId);
    res.json(scheduled);
  } catch (error) {
    console.error('Get planner error:', error);
    res.status(500).json({ message: 'Failed to fetch schedule.' });
  }
});

// POST /api/planner/schedule
router.post('/schedule', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const { postId, scheduledFor, platform } = req.body;

    if (!postId || !scheduledFor || !platform) {
      return res.status(400).json({ message: 'postId, scheduledFor and platform are required.' });
    }

    const post = await getPostById(parseInt(postId));
    if (!post || post.userId !== userId) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const scheduled = await createScheduledPost({
      postId: parseInt(postId),
      userId,
      scheduledFor: new Date(scheduledFor),
      platform,
    });
    res.status(201).json(scheduled);
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({ message: 'Failed to schedule post.' });
  }
});

// DELETE /api/planner/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid schedule ID.' });
    }
    const scheduled = await getScheduledPostById(id);
    if (!scheduled || scheduled.userId !== userId) {
      return res.status(404).json({ message: 'Scheduled post not found.' });
    }
    await deleteScheduledPost(id);
    res.json({ message: 'Scheduled post removed.' });
  } catch (error) {
    console.error('Delete scheduled post error:', error);
    res.status(500).json({ message: 'Failed to delete scheduled post.' });
  }
});

export default router;
