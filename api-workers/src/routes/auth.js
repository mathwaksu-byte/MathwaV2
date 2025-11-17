import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { supabase } from '../config/supabase.js';
import { prisma } from '../config/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Admin login
router.post(
  '/admin/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (process.env.USE_LOCAL_ADMIN === 'true') {
        if (email === 'admin@mathwa.com' && password === 'Admin@123') {
          const admin = {
            id: 'dev-admin-id',
            email,
            full_name: 'Admin User',
            role: 'admin'
          };

          const token = jwt.sign(
            { userId: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
          );

          return res.json({ token, user: admin });
        }
        throw new AppError('Invalid credentials', 401);
      }

      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin || (admin.role ?? 'admin') !== 'admin') {
        throw new AppError('Invalid credentials', 401);
      }
      const isValidPassword = await bcrypt.compare(password, admin.password_hash);
      
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const { password_hash, ...safeUser } = admin;
      res.json({ token, user: safeUser });
    } catch (error) {
      next(error);
    }
  }
);

// User signup (for students)
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { email, password, full_name } = req.body;

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert([{
          email,
          password_hash,
          full_name,
          role: 'user'
        }])
        .select()
        .single();

      if (error) throw error;

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      delete user.password_hash;

      res.status(201).json({
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }
);

// User login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      delete user.password_hash;

      res.json({
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
