import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase.js';
import { prisma } from '../config/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Allow dev bypass without auth
const maybeAuth = (req, res, next) => {
  if (process.env.USE_LOCAL_ADMIN === 'true') return next();
  return authenticate(req, res, () => requireAdmin(req, res, next));
};

const upload = multer({ storage: multer.memoryStorage() });

async function getUniversityBySlug(slug) {
  const uni = await prisma.university.findUnique({ where: { slug } });
  if (!uni) throw new AppError('University not found', 404);
  return uni;
}

function publicUrl(bucket, path) {
  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

function urlToPath(url) {
  // Supabase public URL format: .../object/public/<bucket>/<path>
  const marker = '/object/public/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const rest = url.slice(idx + marker.length);
  const [bucket, ...parts] = rest.split('/');
  return { bucket, path: parts.join('/') };
}

// Upload hero/logo DP
router.post('/:slug/dp', maybeAuth, upload.single('file'), async (req, res, next) => {
  try {
    const { slug } = req.params;
    const type = (req.query.type || 'hero').toString();
    if (!req.file) throw new AppError('No file uploaded', 400);

    const uni = await getUniversityBySlug(slug);
    const bucket = 'university-images';
    const folder = type === 'logo' ? `logos/${slug}` : `hero/${slug}`;
    const ext = req.file.originalname.split('.').pop();
    const filename = `${folder}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
    if (upErr) throw upErr;

    const url = publicUrl(bucket, filename);
    const updates = type === 'logo' ? { logo_url: url } : { hero_image_url: url };
    const updated = await prisma.university.update({ where: { id: uni.id }, data: updates });
    res.json({ university: updated });
  } catch (err) {
    next(err);
  }
});

// Clear hero/logo DP
router.delete('/:slug/dp', maybeAuth, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const type = (req.query.type || 'hero').toString();
    const uni = await getUniversityBySlug(slug);
    const field = type === 'logo' ? 'logo_url' : 'hero_image_url';
    const current = uni[field];

    if (current) {
      const parsed = urlToPath(current);
      if (parsed) {
        await supabaseAdmin.storage.from(parsed.bucket).remove([parsed.path]);
      }
    }

    const updated = await prisma.university.update({ where: { id: uni.id }, data: { [field]: null } });
    res.json({ university: updated });
  } catch (err) {
    next(err);
  }
});

// Upload gallery images
router.post('/:slug/gallery', maybeAuth, upload.array('images', 20), async (req, res, next) => {
  try {
    const { slug } = req.params;
    const uni = await getUniversityBySlug(slug);
    if (!req.files || req.files.length === 0) throw new AppError('No files uploaded', 400);

    const bucket = 'university-images';
    const uploaded = [];
    for (const file of req.files) {
      const ext = file.originalname.split('.').pop();
      const filename = `gallery/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filename, file.buffer, { contentType: file.mimetype, upsert: false });
      if (upErr) throw upErr;
      const url = publicUrl(bucket, filename);
      const current = Array.isArray(uni.gallery_urls) ? uni.gallery_urls : [];
      const next = [...current, url];
      await prisma.university.update({ where: { id: uni.id }, data: { gallery_urls: next } });
      uploaded.push({ url });
    }

    // Return university with gallery
    const university = await prisma.university.findUnique({ where: { id: uni.id } });
    res.json({ university });
  } catch (err) {
    next(err);
  }
});

// Delete gallery images by URLs
router.delete('/:slug/gallery', maybeAuth, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { urls = [] } = req.body || {};
    const uni = await getUniversityBySlug(slug);
    const toRemove = Array.isArray(urls) ? urls : [];
    for (const url of toRemove) {
      const parsed = urlToPath(url);
      if (parsed) {
        await supabaseAdmin.storage.from(parsed.bucket).remove([parsed.path]);
      }
      const current = Array.isArray(uni.gallery_urls) ? uni.gallery_urls : [];
      const next = current.filter(u => u !== url);
      await prisma.university.update({ where: { id: uni.id }, data: { gallery_urls: next } });
    }

    const university = await prisma.university.findUnique({ where: { id: uni.id } });
    res.json({ university });
  } catch (err) {
    next(err);
  }
});

export default router;
