import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/userService';
import { extractTokenFromHeader, JWTPayload, verifyToken } from '../utils/auth';
import logger from '../utils/logger';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & { isActive: boolean };
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        error: 'Access token required',
        message:
          'Please provide a valid access token in the Authorization header',
      });
      return;
    }

    // Verify and decode token
    const payload = verifyToken(token);

    // Verify user still exists and is active
    const user = await findUserById(payload.userId);
    if (!user || !user.is_active) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'User not found or inactive',
      });
      return;
    }

    // Add user info to request
    req.user = {
      ...payload,
      isActive: user.is_active,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof Error && error.message === 'Invalid token') {
      res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired',
      });
    } else {
      res.status(500).json({
        error: 'Authentication failed',
        message: 'An error occurred during authentication',
      });
    }
  }
};

/**
 * Authorization middleware - checks user roles
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication - adds user info if token is provided, but doesn't fail if missing
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      const user = await findUserById(payload.userId);

      if (user && user.is_active) {
        req.user = {
          ...payload,
          isActive: user.is_active,
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    logger.warn('Optional auth failed:', error);
    next();
  }
};

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Partner or Admin middleware
 */
export const requirePartnerOrAdmin = requireRole(['partner', 'admin']);

/**
 * Any authenticated user middleware
 */
export const requireAuth = requireRole(['customer', 'partner', 'admin']);

/**
 * Multi-tenant isolation middleware
 */
export const requireTenant = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
    return;
  }

  // Admin users can access any tenant
  if (req.user.role === 'admin') {
    next();
    return;
  }

  // For non-admin users, ensure they can only access their tenant data
  const requestedTenantId =
    req.params.tenantId || req.body.tenantId || req.query.tenantId;

  if (requestedTenantId && req.user.tenantId !== requestedTenantId) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied to this tenant',
    });
    return;
  }

  next();
};
