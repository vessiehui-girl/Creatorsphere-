import { Router, Request, Response } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getPostsByUserId,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../storage.js';
import type { User } from '../../shared/schema.js';

const router = Router();

// GET /api/posts
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const allPosts = await getPostsByUserId(userId);
    res.json(allPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts.' });
  }
});

// POST /api/posts
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const { title, content, mediaUrl, platforms, status } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const post = await createPost({ userId, title, content, mediaUrl, platforms, status: status ?? 'draft' });
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

// GET /api/posts/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post ID.' });
    }

    const post = await getPostById(id);
    if (!post || post.userId !== userId) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Failed to fetch post.' });
  }
});

// PUT /api/posts/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post ID.' });
    }

    const existing = await getPostById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const updated = await updatePost(id, userId, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Failed to update post.' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post ID.' });
    }

    const existing = await getPostById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    await deletePost(id, userId);
    res.json({ message: 'Post deleted.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post.' });
  }
});

export default router;
