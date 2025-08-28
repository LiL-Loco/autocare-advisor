/**
 * Tracking Routes - AutoCare Advisor
 *
 * API endpoints for tracking clicks, impressions, and conversions
 * Implements Pay-per-Click revenue model with real-time analytics
 */

import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth';
import {
  ClickEvent,
  ConversionEvent,
  ImpressionEvent,
  trackingService,
} from '../services/trackingService';
import logger from '../utils/logger';

const router = express.Router();

/**
 * POST /api/tracking/click
 * Track a single product click
 */
router.post(
  '/click',
  authenticateToken,
  [
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required')
      .isString()
      .withMessage('Product ID must be a string'),
    body('partnerUrl')
      .notEmpty()
      .withMessage('Partner URL is required')
      .isURL()
      .withMessage('Partner URL must be a valid URL'),
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string'),
    body('recommendationRank')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Recommendation rank must be a positive integer'),
    body('matchScore')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Match score must be between 0 and 100'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      const partnerId = req.user?.userId;
      if (!partnerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const {
        productId,
        partnerUrl,
        sessionId = uuidv4(),
        recommendationRank,
        matchScore,
        metadata = {},
      } = req.body;

      // Get client information
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        (req.headers['x-real-ip'] as string) ||
        req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const referrer = req.headers.referer;

      const clickEvent: ClickEvent = {
        partnerId,
        productId,
        partnerUrl,
        sessionId,
        recommendationRank,
        matchScore,
        ipAddress,
        userAgent,
        referrer,
        metadata: {
          ...metadata,
          apiVersion: '1.0',
          trackingTimestamp: new Date().toISOString(),
        },
      };

      const result = await trackingService.trackClick(clickEvent);

      if (!result.tracked) {
        return res.status(200).json({
          success: true,
          tracked: false,
          reason: result.reason,
          message: 'Click not tracked - likely duplicate',
        });
      }

      res.status(201).json({
        success: true,
        tracked: true,
        message: 'Click tracked successfully',
        sessionId,
      });
    } catch (error) {
      logger.error('Error in click tracking endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
);

/**
 * POST /api/tracking/impressions
 * Track multiple product impressions in batch
 */
router.post(
  '/impressions',
  authenticateToken,
  [
    body('impressions')
      .isArray({ min: 1, max: 100 })
      .withMessage('Impressions must be an array with 1-100 items'),
    body('impressions.*.productId')
      .notEmpty()
      .withMessage('Each impression must have a product ID'),
    body('impressions.*.sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string'),
    body('impressions.*.viewDuration')
      .optional()
      .isInt({ min: 0 })
      .withMessage('View duration must be a positive integer'),
    body('impressions.*.viewportPosition')
      .optional()
      .isIn(['above-fold', 'below-fold', 'unknown'])
      .withMessage(
        'Viewport position must be above-fold, below-fold, or unknown'
      ),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      const partnerId = req.user?.userId;
      if (!partnerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { impressions } = req.body;

      // Get client information
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        (req.headers['x-real-ip'] as string) ||
        req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const referrer = req.headers.referer;

      const impressionEvents: ImpressionEvent[] = impressions.map(
        (impression: any) => ({
          partnerId,
          productId: impression.productId,
          sessionId: impression.sessionId || uuidv4(),
          viewDuration: impression.viewDuration,
          viewportPosition: impression.viewportPosition || 'unknown',
          ipAddress,
          userAgent,
          referrer,
          metadata: {
            ...impression.metadata,
            batchSize: impressions.length,
            apiVersion: '1.0',
            trackingTimestamp: new Date().toISOString(),
          },
        })
      );

      const result = await trackingService.trackImpressions(impressionEvents);

      res.status(201).json({
        success: true,
        message: 'Impressions processed',
        tracked: result.tracked,
        skipped: result.skipped,
        totalSubmitted: impressions.length,
      });
    } catch (error) {
      logger.error('Error in impressions tracking endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
);

/**
 * POST /api/tracking/conversion
 * Track a conversion event
 */
router.post(
  '/conversion',
  authenticateToken,
  [
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required')
      .isString()
      .withMessage('Product ID must be a string'),
    body('conversionType')
      .isIn(['purchase', 'lead', 'signup'])
      .withMessage('Conversion type must be purchase, lead, or signup'),
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string'),
    body('conversionValue')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Conversion value must be a positive number'),
    body('orderId')
      .optional()
      .isString()
      .withMessage('Order ID must be a string'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      const partnerId = req.user?.userId;
      if (!partnerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const {
        productId,
        conversionType,
        sessionId = uuidv4(),
        conversionValue,
        orderId,
        metadata = {},
      } = req.body;

      // Get client information
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        (req.headers['x-real-ip'] as string) ||
        req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const referrer = req.headers.referer;

      const conversionEvent: ConversionEvent = {
        partnerId,
        productId,
        conversionType,
        sessionId,
        conversionValue,
        orderId,
        ipAddress,
        userAgent,
        referrer,
        metadata: {
          ...metadata,
          apiVersion: '1.0',
          trackingTimestamp: new Date().toISOString(),
        },
      };

      await trackingService.trackConversion(conversionEvent);

      res.status(201).json({
        success: true,
        message: 'Conversion tracked successfully',
        sessionId,
      });
    } catch (error) {
      logger.error('Error in conversion tracking endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
);

/**
 * GET /api/tracking/stats
 * Get usage statistics for authenticated partner
 */
router.get(
  '/stats',
  authenticateToken,
  [
    query('period')
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage('Period must be in YYYY-MM format'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      const partnerId = req.user?.userId;
      if (!partnerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const period = req.query.period as string;
      const stats = await trackingService.getUsageStats(partnerId, period);

      res.json({
        success: true,
        data: stats,
        currentPeriod: period || new Date().toISOString().substring(0, 7),
      });
    } catch (error) {
      logger.error('Error in stats endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
);

/**
 * GET /api/tracking/health
 * Health check endpoint for tracking system
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Simple health check - could be expanded
    res.json({
      success: true,
      message: 'Tracking system operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    logger.error('Error in tracking health endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Tracking system health check failed',
    });
  }
});

export default router;
