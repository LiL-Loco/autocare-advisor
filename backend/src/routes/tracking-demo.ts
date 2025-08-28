import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const router = Router();

/**
 * DEMO MODE TRACKING ENDPOINTS
 * These endpoints simulate the tracking functionality without authentication
 * for testing and demonstration purposes.
 */

/**
 * GET /api/tracking-demo/health - Health Check
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Tracking demo system operational',
    timestamp: new Date().toISOString(),
    mode: 'demo',
    version: '1.0.0',
  });
});

/**
 * POST /api/tracking-demo/click - Demo Click Tracking
 */
router.post('/click', (req: Request, res: Response) => {
  const { productId, partnerId, sessionId, metadata } = req.body;

  // Simulate processing
  const trackingId = uuidv4();
  const timestamp = new Date().toISOString();

  logger.info(`Demo click tracked: Product ${productId}, Partner ${partnerId}`);

  res.json({
    success: true,
    message: 'Click tracked successfully (DEMO MODE)',
    data: {
      trackingId,
      productId,
      partnerId,
      sessionId,
      timestamp,
      billing: {
        cost: 0.5, // Demo cost
        tier: 'Basic',
        currency: 'EUR',
      },
      metadata: {
        ...metadata,
        demo: true,
        processed: timestamp,
      },
    },
  });
});

/**
 * POST /api/tracking-demo/impressions - Demo Impression Tracking
 */
router.post('/impressions', (req: Request, res: Response) => {
  const { productId, partnerId, sessionId, count = 1, metadata } = req.body;

  const trackingId = uuidv4();
  const timestamp = new Date().toISOString();

  logger.info(`Demo impressions tracked: ${count} for Product ${productId}`);

  res.json({
    success: true,
    message: `${count} impression(s) tracked successfully (DEMO MODE)`,
    data: {
      trackingId,
      productId,
      partnerId,
      sessionId,
      count,
      timestamp,
      billing: {
        cost: 0.05 * count, // Demo impression cost
        tier: 'Basic',
        currency: 'EUR',
      },
      metadata: {
        ...metadata,
        demo: true,
        processed: timestamp,
      },
    },
  });
});

/**
 * POST /api/tracking-demo/conversion - Demo Conversion Tracking
 */
router.post('/conversion', (req: Request, res: Response) => {
  const { productId, partnerId, sessionId, conversionValue, metadata } =
    req.body;

  const trackingId = uuidv4();
  const timestamp = new Date().toISOString();

  logger.info(
    `Demo conversion tracked: €${conversionValue} for Product ${productId}`
  );

  res.json({
    success: true,
    message: 'Conversion tracked successfully (DEMO MODE)',
    data: {
      trackingId,
      productId,
      partnerId,
      sessionId,
      conversionValue,
      timestamp,
      billing: {
        commission: conversionValue * 0.05, // 5% commission
        tier: 'Basic',
        currency: 'EUR',
      },
      metadata: {
        ...metadata,
        demo: true,
        processed: timestamp,
      },
    },
  });
});

/**
 * GET /api/tracking-demo/stats - Demo Usage Statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Generate demo statistics
  const demoStats = {
    success: true,
    message: 'Usage statistics retrieved (DEMO MODE)',
    data: {
      period: {
        month: currentMonth,
        year: currentYear,
      },
      partner: {
        id: 'demo-partner-001',
        name: 'Demo Partner',
        tier: 'Professional',
        status: 'active',
      },
      usage: {
        clicks: {
          total: 1247,
          thisMonth: 342,
          cost: {
            total: 623.5,
            thisMonth: 171.0,
            currency: 'EUR',
          },
        },
        impressions: {
          total: 15890,
          thisMonth: 4320,
          cost: {
            total: 79.45,
            thisMonth: 21.6,
            currency: 'EUR',
          },
        },
        conversions: {
          total: 89,
          thisMonth: 23,
          revenue: {
            total: 2840.75,
            thisMonth: 745.2,
            commission: 142.04,
            currency: 'EUR',
          },
        },
      },
      limits: {
        tier: 'Professional',
        monthlyClickLimit: 5000,
        clicksUsed: 342,
        clicksRemaining: 4658,
        utilizationPercentage: 6.84,
      },
      topProducts: [
        {
          productId: '507f1f77bcf86cd799439011',
          name: 'Premium Car Shampoo',
          clicks: 89,
          conversions: 7,
          revenue: 245.6,
        },
        {
          productId: '507f1f77bcf86cd799439012',
          name: 'Tire Shine Spray',
          clicks: 76,
          conversions: 5,
          revenue: 189.3,
        },
        {
          productId: '507f1f77bcf86cd799439013',
          name: 'Interior Cleaner',
          clicks: 65,
          conversions: 4,
          revenue: 156.8,
        },
      ],
      trends: {
        clickTrend: [15, 23, 18, 29, 34, 28, 31, 42, 38, 35, 41, 45],
        conversionRate: 0.067,
        averageOrderValue: 32.4,
        costPerClick: 0.35,
      },
      demo: true,
      generated: new Date().toISOString(),
    },
  };

  res.json(demoStats);
});

export default router;
