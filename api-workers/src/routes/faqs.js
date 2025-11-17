import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = express.Router();

// Get all active FAQs (public)
router.get('/', async (req, res, next) => {
  try {
    const faqs = await prisma.fAQ.findMany({ where: { active: true }, orderBy: { created_at: 'asc' } });
    res.json({ faqs });
  } catch (error) { next(error); }
});

// Admin: Get all FAQs
router.get('/admin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { created_at: 'asc' } });
    res.json({ faqs });
  } catch (error) { next(error); }
});

router.get('/admin/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    res.json({ faq });
  } catch (error) { next(error); }
});

// Admin: Create FAQ
router.post(
  '/admin',
  authenticate,
  requireAdmin,
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const faq = await prisma.fAQ.create({ data: req.body });
      res.status(201).json({ faq });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Update FAQ
router.put(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('Invalid FAQ ID'), validate],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const faq = await prisma.fAQ.update({ where: { id }, data: req.body });
      res.json({ faq });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Delete FAQ
router.delete(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('Invalid FAQ ID'), validate],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.fAQ.delete({ where: { id } });
      res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
