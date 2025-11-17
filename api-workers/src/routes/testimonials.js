import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = express.Router();

// Get all active testimonials (public)
router.get('/', async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ where: { active: true }, orderBy: { created_at: 'desc' } });
    res.json({ testimonials });
  } catch (error) { next(error); }
});

// Admin: Get all testimonials
router.get('/admin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { created_at: 'desc' } });
    res.json({ testimonials });
  } catch (error) { next(error); }
});

router.get('/admin/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    res.json({ testimonial });
  } catch (error) { next(error); }
});

// Admin: Create testimonial
router.post(
  '/admin',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('quote').optional().trim(),
    validate
  ],
  async (req, res, next) => {
    try {
      const testimonial = await prisma.testimonial.create({ data: req.body });
      res.status(201).json({ testimonial });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Update testimonial
router.put(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('Invalid testimonial ID'), validate],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body });
      res.json({ testimonial });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Delete testimonial
router.delete(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('Invalid testimonial ID'), validate],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.testimonial.delete({ where: { id } });
      res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
