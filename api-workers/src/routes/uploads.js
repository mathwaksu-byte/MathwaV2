import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,application/pdf').split(',');
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type', 400), false);
    }
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { bucket = 'uploads', folder = '' } = req.body;
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${uuidv4()}.${fileExt}`;

    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return res.json({
        file: {
          path: data.path,
          url: publicUrl,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (err) {
      // In production, do NOT fallback — require proper Supabase configuration
      const allowLocal = (process.env.ALLOW_LOCAL_UPLOADS || 'false') === 'true';
      const isProd = (process.env.NODE_ENV || 'development') === 'production';
      if (isProd || !allowLocal) {
        return next(new AppError('Storage upload failed. Configure SUPABASE_URL and keys.', 500));
      }
      const base = path.resolve(process.cwd(), 'uploads');
      const outPath = path.join(base, bucket, fileName.replace(/\\/g, '/'));
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, req.file.buffer);
      const origin = `${req.protocol}://${req.get('host')}`;
      const publicUrl = `${origin}/files/${bucket}/${fileName}`;
      return res.json({
        file: {
          path: `${bucket}/${fileName}`,
          url: publicUrl,
          size: req.file.size,
          mimetype: req.file.mimetype,
          fallback: true
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const { bucket = 'uploads', folder = '' } = req.body;
    const uploadPromises = req.files.map(async (file) => {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${uuidv4()}.${fileExt}`;

      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return {
        path: data.path,
        url: publicUrl,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    const files = await Promise.all(uploadPromises);

    res.json({ files });
  } catch (error) {
    next(error);
  }
});

// Delete file
router.delete('/', authenticate, async (req, res, next) => {
  try {
    const { bucket = 'uploads', path } = req.body;

    if (!path) {
      throw new AppError('File path is required', 400);
    }

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
