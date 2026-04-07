import { Router } from 'express';
import { db } from '../db.js';
import { connectedPlatforms } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const platforms = await db
      .select()
      .from(connectedPlatforms)
      .where(eq(connectedPlatforms.userId, req.session.userId!));
    return res.json(platforms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/connect', requireAuth, async (req, res) => {
  try {
    const { platforms } = req.body as { platforms: string[] };
    if (!Array.isArray(platforms)) {
      return res.status(400).json({ message: 'platforms must be an array' });
    }
    const userId = req.session.userId!;

    const existing = await db
      .select()
      .from(connectedPlatforms)
      .where(and(eq(connectedPlatforms.userId, userId)));

    const existingMap = new Map(existing.map((p) => [p.platform, p]));
    const results = [];

    for (const platform of platforms) {
      const record = existingMap.get(platform);
      if (record) {
        const [updated] = await db
          .update(connectedPlatforms)
          .set({ connected: true })
          .where(eq(connectedPlatforms.id, record.id))
          .returning();
        results.push(updated);
      } else {
        const [inserted] = await db
          .insert(connectedPlatforms)
          .values({ userId, platform, connected: true })
          .returning();
        results.push(inserted);
      }
    }
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { connected } = req.body;
    const [updated] = await db
      .update(connectedPlatforms)
      .set({ connected })
      .where(and(eq(connectedPlatforms.id, id), eq(connectedPlatforms.userId, req.session.userId!)))
      .returning();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
