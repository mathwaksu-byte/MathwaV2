import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all published blogs (public)
router.get('/', async (req, res, next) => {
  try {
    const blogs = await prisma.article.findMany({ where: { active: true }, orderBy: { created_at: 'desc' } });
    res.json({ blogs });
  } catch (error) { next(error); }
});

// Get single blog by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await prisma.article.findUnique({ where: { slug } });
    if (!blog || !blog.active) throw new AppError('Blog not found', 404);
    res.json({ blog });
  } catch (error) { next(error); }
});

// Admin: Get all blogs
router.get('/admin/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const blogs = await prisma.article.findMany({ orderBy: { created_at: 'desc' } });
    res.json({ blogs });
  } catch (error) { next(error); }
});

router.get('/admin/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await prisma.article.findUnique({ where: { id } });
    res.json({ blog });
  } catch (error) { next(error); }
});

// Admin: Create blog
router.post(
  '/admin',
  authenticate,
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const blog = await prisma.article.create({ data: req.body });
      res.status(201).json({ blog });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Update blog
router.put(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('Invalid blog ID'), validate],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const blog = await prisma.article.update({ where: { id }, data: req.body });
      res.json({ blog });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Delete blog
router.delete(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('Invalid blog ID'), validate],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.article.delete({ where: { id } });
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
