import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public stats for homepage
router.get('/public', async (req, res, next) => {
  try {
    const { data: stats, error } = await supabase
      .from('site_stats')
      .select('*')
      .single();

    if (error) throw error;

    res.json({ stats: stats || {
      students_sent: 0,
      years_of_partnership: 0,
      countries: 0,
      success_rate: 0
    }});
  } catch (error) {
    next(error);
  }
});

// Admin: Get dashboard stats
router.get('/admin/dashboard', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const [totalApplications, pendingApplications, approvedApplications, totalUniversities, recentApplications] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'pending' } }),
      prisma.lead.count({ where: { status: 'approved' } }),
      prisma.university.count({ where: { active: true } }),
      prisma.lead.count({ where: { created_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
    ]);
    res.json({
      stats: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalUniversities,
        recentApplications
      }
    });
  } catch (error) { next(error); }
});

// Admin: Update public stats
router.put('/admin/public', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { data: stats, error } = await supabaseAdmin
      .from('site_stats')
      .upsert(req.body)
      .select()
      .single();

    if (error) throw error;

    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

export default router;
