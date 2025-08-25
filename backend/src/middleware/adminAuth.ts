import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Middleware to ensure only admin users can access certain routes
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is authenticated (from auth middleware)
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      logger.warn(`Non-admin user attempted to access admin route`, {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role,
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required to access this resource',
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    logger.error('Error in admin middleware:', error);
    res.status(500).json({
      error: 'Authorization check failed',
      message: 'An error occurred while checking permissions',
    });
  }
};

/**
 * Middleware to ensure only admin or the user themselves can access user-specific routes
 */
export const requireAdminOrSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    const targetUserId = req.params.userId || req.params.id;

    // Admin can access any user's data
    if (req.user.role === 'admin') {
      return next();
    }

    // User can only access their own data
    if (req.user.userId === targetUserId) {
      return next();
    }

    logger.warn(`User attempted to access another user's data`, {
      userId: req.user.userId,
      targetUserId: targetUserId,
      path: req.path,
    });

    return res.status(403).json({
      error: 'Access denied',
      message: 'You can only access your own data',
    });
  } catch (error) {
    logger.error('Error in admin-or-self middleware:', error);
    res.status(500).json({
      error: 'Authorization check failed',
      message: 'An error occurred while checking permissions',
    });
  }
};
