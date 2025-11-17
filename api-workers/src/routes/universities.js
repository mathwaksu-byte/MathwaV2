import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all active universities (public)
router.get('/', async (req, res, next) => {
  try {
    const universities = await prisma.university.findMany({ where: { active: true }, orderBy: { created_at: 'desc' } });
    res.json({ universities });
  } catch (error) { next(error); }
});

// Get single university by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const university = await prisma.university.findUnique({ where: { slug } });
    if (!university || !university.active) throw new AppError('University not found', 404);
    const feeRows = await prisma.fee.findMany({ where: { university_id: university.id }, orderBy: { year: 'asc' } });
    const fees = feeRows.map(r => ({ year: r.year, tuition: Number(r.tuition), hostel: Number(r.hostel), misc: Number(r.misc), currency: r.currency }));
    res.json({ university, fees });
  } catch (error) { next(error); }
});

// Admin: Get all universities (including inactive)
router.get('/admin/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const universities = await prisma.university.findMany({ orderBy: { created_at: 'desc' } });
    res.json({ universities });
  } catch (error) { next(error); }
});

router.get('/admin/:id', authenticate, requireAdmin, async (req, res, next) => {
  try { const { id } = req.params; const university = await prisma.university.findUnique({ where: { id } }); res.json({ university }); } catch (error) { next(error); }
});

// Admin: Create university
router.post(
  '/admin',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('overview').optional().trim(),
    validate
  ],
  async (req, res, next) => {
    try {
      const university = await prisma.university.create({ data: req.body });
      res.status(201).json({ university });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Update university
router.put(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [ param('id').isUUID().withMessage('Invalid university ID'), validate ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const university = await prisma.university.update({ where: { id }, data: req.body });
      res.json({ university });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Delete university
router.delete(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [ param('id').isUUID().withMessage('Invalid university ID'), validate ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.university.delete({ where: { id } });
      res.json({ message: 'University deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Toggle university active status
router.patch(
  '/admin/:id/toggle',
  authenticate,
  requireAdmin,
  [ param('id').isUUID().withMessage('Invalid university ID'), validate ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const university = await prisma.university.findUnique({ where: { id } });
      const updated = await prisma.university.update({ where: { id }, data: { active: !university?.active } });
      res.json({ university: updated });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
 
// Fees management by university slug (admin)
router.post(
  '/:slug/fees',
  authenticate,
  requireAdmin,
  [
    param('slug').trim().notEmpty().withMessage('Slug is required'),
    body('fees').isArray().withMessage('Fees array is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { fees = [], replace = false } = req.body;
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) throw new AppError('University not found', 404);
      if (replace) { await prisma.fee.deleteMany({ where: { university_id: uni.id } }); }
      if (Array.isArray(fees) && fees.length > 0) {
        await prisma.$transaction(
          fees.map(f => prisma.fee.upsert({
            where: { university_id_year: { university_id: uni.id, year: f.year } },
            update: { tuition: f.tuition || 0, hostel: f.hostel || 0, misc: f.misc || 0, currency: f.currency || 'INR' },
            create: { university_id: uni.id, year: f.year, tuition: f.tuition || 0, hostel: f.hostel || 0, misc: f.misc || 0, currency: f.currency || 'INR' }
          }))
        );
      }
      const loaded = await prisma.fee.findMany({ where: { university_id: uni.id }, orderBy: { year: 'asc' } });
      const out = loaded.map(r => ({ year: r.year, tuition: Number(r.tuition), hostel: Number(r.hostel), misc: Number(r.misc), currency: r.currency || 'INR' }));
      res.json({ fees: out });
    } catch (err) { next(err); }
  }
);

router.delete(
  '/:slug/fees',
  authenticate,
  requireAdmin,
  [
    param('slug').trim().notEmpty().withMessage('Slug is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { year, all } = req.body || {};
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) throw new AppError('University not found', 404);
      if (all) { await prisma.fee.deleteMany({ where: { university_id: uni.id } }); }
      else if (typeof year === 'number') { await prisma.fee.delete({ where: { university_id_year: { university_id: uni.id, year } } }); }
      else { throw new AppError('Specify year or all=true', 400); }
      const loaded = await prisma.fee.findMany({ where: { university_id: uni.id }, orderBy: { year: 'asc' } });
      const out = loaded.map(r => ({ year: r.year, tuition: Number(r.tuition), hostel: Number(r.hostel), misc: Number(r.misc), currency: r.currency || 'INR' }));
      res.json({ fees: out });
    } catch (err) { next(err); }
  }
);
