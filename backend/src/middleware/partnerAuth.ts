/**
 * Partner-specific authentication middleware
 */

import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to ensure authenticated user is a partner
 */
export const requirePartner = (
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

  if (req.user.role !== 'partner') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Partner access required',
    });
    return;
  }

  next();
};
