import { Router } from 'express';
import { db } from '../db.js';
import { posts } from '../../shared/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, req.session.userId!))
      .orderBy(desc(posts.createdAt));
    return res.json(userPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { caption, mediaUrl, status } = req.body;
    const [post] = await db
      .insert(posts)
      .values({ userId: req.session.userId!, caption, mediaUrl, status: status || 'draft' })
      .returning();
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { caption, status } = req.body;
    const [updated] = await db
      .update(posts)
      .set({ caption, status })
      .where(and(eq(posts.id, id), eq(posts.userId, req.session.userId!)))
      .returning();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
