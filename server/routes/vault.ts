import { Router, Request, Response } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getVaultItemsByUserId,
  getVaultItemById,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
} from '../storage.js';
import type { User } from '../../shared/schema.js';

const router = Router();

// GET /api/vault
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const items = await getVaultItemsByUserId(userId);
    res.json(items);
  } catch (error) {
    console.error('Get vault items error:', error);
    res.status(500).json({ message: 'Failed to fetch vault items.' });
  }
});

// POST /api/vault
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const { title, content, mediaUrl, mediaType, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const item = await createVaultItem({ userId, title, content, mediaUrl, mediaType, tags });
    res.status(201).json(item);
  } catch (error) {
    console.error('Create vault item error:', error);
    res.status(500).json({ message: 'Failed to create vault item.' });
  }
});

// PUT /api/vault/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid vault item ID.' });
    }

    const existing = await getVaultItemById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Vault item not found.' });
    }

    const updated = await updateVaultItem(id, userId, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Update vault item error:', error);
    res.status(500).json({ message: 'Failed to update vault item.' });
  }
});

// DELETE /api/vault/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid vault item ID.' });
    }

    const existing = await getVaultItemById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Vault item not found.' });
    }

    await deleteVaultItem(id, userId);
    res.json({ message: 'Vault item deleted.' });
  } catch (error) {
    console.error('Delete vault item error:', error);
    res.status(500).json({ message: 'Failed to delete vault item.' });
  }
});

export default router;
