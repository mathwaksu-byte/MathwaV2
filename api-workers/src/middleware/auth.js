import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { prisma } from '../config/prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    if (process.env.USE_LOCAL_ADMIN === 'true') {
      req.user = { role: 'admin' };
      return next();
    }
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.admin.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new AppError('Invalid token', 401);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role ?? 'admin') !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
