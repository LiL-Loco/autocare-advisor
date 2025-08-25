/**
 * Partner Analytics API Routes - AutoCare Advisor
 *
 * Provides comprehensive analytics endpoints for B2B Partner Dashboard
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, param, validationResult } from 'express-validator';
import partnerAnalyticsService from '../services/partnerAnalyticsService';
import logger from '../utils/logger';

const router = express.Router();

// Rate limiting für Analytics-Requests
const analyticsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 200, // Max 200 Requests pro 15 min pro IP (höher als Recommendations)
  message: {
    error: 'Too many analytics requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateRequest = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
      code: 'VALIDATION_ERROR',
    });
  }
  next();
};

/**
 * GET /api/partners/analytics/overview/:partnerId
 * Comprehensive partner analytics dashboard data
 */
router.get(
  '/overview/:partnerId',
  analyticsRateLimit,
  [
    param('partnerId')
      .notEmpty()
      .withMessage('Partner ID is required')
      .isMongoId()
      .withMessage('Invalid partner ID format'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { partnerId } = req.params;

      logger.info('Partner analytics overview requested', { partnerId });

      const analytics = await partnerAnalyticsService.getPartnerAnalytics(
        partnerId
      );

      res.json({
        success: true,
        data: analytics,
        meta: {
          timestamp: new Date().toISOString(),
          partnerId,
          version: '1.0',
        },
      });
    } catch (error: any) {
      logger.error('Failed to get partner analytics overview', {
        error: error.message,
        partnerId: req.params.partnerId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve analytics data',
        message: error.message,
        code: 'ANALYTICS_ERROR',
      });
    }
  }
);

/**
 * GET /api/partners/analytics/products/:partnerId
 * Detailed product performance metrics
 */
router.get(
  '/products/:partnerId',
  analyticsRateLimit,
  [
    param('partnerId')
      .notEmpty()
      .withMessage('Partner ID is required')
      .isMongoId()
      .withMessage('Invalid partner ID format'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { partnerId } = req.params;

      const productMetrics =
        await partnerAnalyticsService.getProductPerformanceMetrics(partnerId);

      res.json({
        success: true,
        data: {
          products: productMetrics,
          totalProducts: productMetrics.length,
          avgConversionRate:
            productMetrics.reduce(
              (sum, p) => sum + p.metrics.conversionRate,
              0
            ) / productMetrics.length || 0,
        },
        meta: {
          timestamp: new Date().toISOString(),
          partnerId,
        },
      });
    } catch (error: any) {
      logger.error('Failed to get product performance metrics', {
        error: error.message,
        partnerId: req.params.partnerId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve product metrics',
        message: error.message,
        code: 'PRODUCT_METRICS_ERROR',
      });
    }
  }
);

/**
 * GET /api/partners/analytics/revenue/:partnerId
 * Revenue analytics and commission tracking
 */
router.get(
  '/revenue/:partnerId',
  analyticsRateLimit,
  [
    param('partnerId')
      .notEmpty()
      .withMessage('Partner ID is required')
      .isMongoId()
      .withMessage('Invalid partner ID format'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { partnerId } = req.params;

      const revenueAnalytics =
        await partnerAnalyticsService.getRevenueAnalytics(partnerId);

      res.json({
        success: true,
        data: revenueAnalytics,
        meta: {
          timestamp: new Date().toISOString(),
          partnerId,
          currency: 'EUR',
        },
      });
    } catch (error: any) {
      logger.error('Failed to get revenue analytics', {
        error: error.message,
        partnerId: req.params.partnerId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve revenue data',
        message: error.message,
        code: 'REVENUE_ERROR',
      });
    }
  }
);

/**
 * GET /api/partners/analytics/tier-recommendation/:partnerId
 * Partner tier recommendations based on performance
 */
router.get(
  '/tier-recommendation/:partnerId',
  analyticsRateLimit,
  [
    param('partnerId')
      .notEmpty()
      .withMessage('Partner ID is required')
      .isMongoId()
      .withMessage('Invalid partner ID format'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { partnerId } = req.params;

      const tierRecommendation =
        await partnerAnalyticsService.getTierRecommendations(partnerId);

      res.json({
        success: true,
        data: tierRecommendation,
        meta: {
          timestamp: new Date().toISOString(),
          partnerId,
        },
      });
    } catch (error: any) {
      logger.error('Failed to get tier recommendations', {
        error: error.message,
        partnerId: req.params.partnerId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get tier recommendations',
        message: error.message,
        code: 'TIER_RECOMMENDATION_ERROR',
      });
    }
  }
);

/**
 * POST /api/partners/analytics/export/:partnerId
 * Export analytics data (CSV/JSON)
 */
router.post(
  '/export/:partnerId',
  analyticsRateLimit,
  [
    param('partnerId')
      .notEmpty()
      .withMessage('Partner ID is required')
      .isMongoId()
      .withMessage('Invalid partner ID format'),

    body('format')
      .notEmpty()
      .withMessage('Export format is required')
      .isIn(['csv', 'json', 'xlsx'])
      .withMessage('Invalid export format'),

    body('dateRange')
      .optional()
      .isObject()
      .withMessage('Date range must be an object'),

    body('includeProducts')
      .optional()
      .isBoolean()
      .withMessage('Include products must be boolean'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { partnerId } = req.params;
      const { format, dateRange, includeProducts = true } = req.body;

      logger.info('Analytics export requested', {
        partnerId,
        format,
        dateRange,
        includeProducts,
      });

      // Get comprehensive analytics data
      const [analytics, productMetrics, revenueData] = await Promise.all([
        partnerAnalyticsService.getPartnerAnalytics(partnerId),
        includeProducts
          ? partnerAnalyticsService.getProductPerformanceMetrics(partnerId)
          : Promise.resolve([]),
        partnerAnalyticsService.getRevenueAnalytics(partnerId),
      ]);

      const exportData = {
        overview: analytics.overview,
        performance: analytics.performance,
        recommendations: analytics.recommendations,
        insights: analytics.insights,
        ...(includeProducts && { products: productMetrics }),
        revenue: revenueData,
        exportInfo: {
          generatedAt: new Date().toISOString(),
          partnerId,
          format,
          dateRange: dateRange || 'all-time',
        },
      };

      // For demo purposes, return JSON data
      // In production, would generate actual files
      if (format === 'json') {
        res.json({
          success: true,
          data: exportData,
          meta: {
            format,
            size: JSON.stringify(exportData).length,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        // For CSV/XLSX, would generate actual file and provide download link
        res.json({
          success: true,
          data: {
            message: `${format.toUpperCase()} export prepared`,
            downloadUrl: `/api/partners/analytics/download/${partnerId}/${format}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          },
          meta: {
            format,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error: any) {
      logger.error('Failed to export analytics data', {
        error: error.message,
        partnerId: req.params.partnerId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to export analytics data',
        message: error.message,
        code: 'EXPORT_ERROR',
      });
    }
  }
);

/**
 * GET /api/partners/analytics/summary
 * Platform-wide analytics summary (for admin use)
 */
router.get(
  '/summary',
  analyticsRateLimit,
  async (req: express.Request, res: express.Response) => {
    try {
      // Mock platform-wide summary
      const summary = {
        totalPartners: 15,
        activePartners: 12,
        totalProducts: 89,
        totalRecommendations: 15420,
        totalRevenue: 45890,
        avgConversionRate: 4.2,
        topPerformingCategories: [
          { category: 'Polituren & Wachse', revenue: 12450 },
          { category: 'Felgenpflege', revenue: 9870 },
          { category: 'Lackreinigung', revenue: 8940 },
        ],
        monthlyGrowth: {
          partners: 15.2,
          revenue: 8.7,
          recommendations: 12.4,
        },
      };

      res.json({
        success: true,
        data: summary,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      });
    } catch (error: any) {
      logger.error('Failed to get platform summary', {
        error: error.message,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve platform summary',
        message: error.message,
        code: 'SUMMARY_ERROR',
      });
    }
  }
);

export default router;
