import { Router } from 'express';
import { db } from '../db.js';
import { vaultItems } from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const items = await db
      .select()
      .from(vaultItems)
      .where(eq(vaultItems.userId, req.session.userId!))
      .orderBy(desc(vaultItems.createdAt));
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { type, title, content, fileUrl } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });
    const [item] = await db
      .insert(vaultItems)
      .values({ userId: req.session.userId!, type, title, content, fileUrl })
      .returning();
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
