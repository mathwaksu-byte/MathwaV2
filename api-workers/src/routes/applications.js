import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendToWebhook } from '../utils/webhook.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Submit application (public)
router.post(
  '/',
  [
    body('full_name').optional().trim(),
    body('name').optional().trim(),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('neet_qualified').optional().isBoolean().toBoolean(),
    body('preferred_university_slug').optional().trim(),
    body('preferred_year').optional().isInt({ min: 1, max: 6 }).toInt(),
    validate
  ],
  async (req, res, next) => {
    try {
      const applicationData = req.body;
      const lead = await prisma.lead.create({
        data: {
          id: uuidv4(),
          name: applicationData.full_name || applicationData.name,
          email: applicationData.email,
          phone: applicationData.phone,
          city: applicationData.city,
          neet_qualified: applicationData.neet_qualified === true || applicationData.neet_qualified === 'true' || applicationData.neet_qualified === 'on' ? true : false,
          marksheet_url: applicationData.marksheet_url ? String(applicationData.marksheet_url) : null,
          preferred_university_slug: applicationData.preferred_university_slug,
          preferred_year: typeof applicationData.preferred_year === 'number' ? applicationData.preferred_year : (applicationData.preferred_year ? parseInt(String(applicationData.preferred_year), 10) : null),
          status: 'pending'
        }
      });

      // Send to CRM webhook (non-blocking)
      if (process.env.CRM_WEBHOOK_URL) {
        sendToWebhook(lead).catch(err => 
          console.error('Webhook error:', err)
        );
      }

      res.status(201).json({ 
        application: lead,
        message: 'Application submitted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Get all applications
router.get('/admin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status: String(status) } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [applications, count] = await Promise.all([
      prisma.lead.findMany({ where, orderBy: { created_at: 'desc' }, skip, take: Number(limit) }),
      prisma.lead.count({ where })
    ]);
    res.json({ 
      applications,
      pagination: {
        total: count,
        page: parseInt(String(page)),
        limit: parseInt(String(limit)),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get single application
router.get('/admin/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await prisma.lead.findUnique({ where: { id } });
    if (!application) throw new AppError('Application not found', 404);
    res.json({ application });
  } catch (error) {
    next(error);
  }
});

// Admin: Update application status
router.patch(
  '/admin/:id/status',
  authenticate,
  requireAdmin,
  [
    param('id').isUUID().withMessage('Invalid application ID'),
    body('status').isIn(['pending', 'reviewing', 'approved', 'rejected']).withMessage('Invalid status'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const application = await prisma.lead.update({ where: { id }, data: { status, notes } });
      res.json({ application });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Delete application
router.delete(
  '/admin/:id',
  authenticate,
  requireAdmin,
  [
    param('id').isUUID().withMessage('Invalid application ID'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.lead.delete({ where: { id } });
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
