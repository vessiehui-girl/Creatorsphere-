import { Router, Request, Response } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getPlatformsByUserId,
  createPlatform,
  deletePlatform,
} from '../storage.js';
import type { User } from '../../shared/schema.js';

const router = Router();

// GET /api/platforms
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const platforms = await getPlatformsByUserId(userId);
    res.json(platforms);
  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({ message: 'Failed to fetch platforms.' });
  }
});

// POST /api/platforms/connect
router.post('/connect', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const { platform, platformUserId, accessToken, refreshToken } = req.body;

    if (!platform) {
      return res.status(400).json({ message: 'Platform name is required.' });
    }

    const connected = await createPlatform({
      userId,
      platform,
      platformUserId,
      accessToken,
      refreshToken,
    });
    res.status(201).json(connected);
  } catch (error) {
    console.error('Connect platform error:', error);
    res.status(500).json({ message: 'Failed to connect platform.' });
  }
});

// DELETE /api/platforms/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid platform ID.' });
    }
    await deletePlatform(id, userId);
    res.json({ message: 'Platform disconnected.' });
  } catch (error) {
    console.error('Delete platform error:', error);
    res.status(500).json({ message: 'Failed to disconnect platform.' });
  }
});

export default router;
