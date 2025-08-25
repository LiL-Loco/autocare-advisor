/**
 * Billing & Subscription API Routes
 * AutoCare Advisor - Payment & Subscription System
 *
 * RESTful API endpoints for managing subscriptions, payments,
 * usage tracking, and billing operations.
 */

import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body, param, query, validationResult } from 'express-validator';
import { Pool } from 'pg';
import { SUBSCRIPTION_TIERS, validateWebhookSignature } from '../config/stripe';
import { authenticateToken } from '../middleware/auth';
import BillingService from '../services/billingService';
import logger from '../utils/logger';

const router = express.Router();

// Initialize billing service (this would be injected in real app)
let billingService: BillingService;

// Rate limiting for billing operations
const billingRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many billing requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stripe webhook rate limit (more restrictive)
const webhookRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit webhook requests
  message: 'Webhook rate limit exceeded',
});

// Apply rate limiting to all billing routes
router.use(billingRateLimit);

/**
 * Initialize billing service with database connection
 */
export function initializeBillingRoutes(database: Pool): express.Router {
  billingService = new BillingService(database);
  return router;
}

// ========================================
// PUBLIC ENDPOINTS (No Authentication)
// ========================================

/**
 * GET /api/billing/subscription-tiers
 * Get available subscription tiers and pricing
 */
router.get('/subscription-tiers', (req: Request, res: Response) => {
  try {
    // Return public tier information (without sensitive data)
    const publicTiers = Object.entries(SUBSCRIPTION_TIERS).map(
      ([key, tier]) => ({
        id: key,
        name: tier.name,
        price: tier.price,
        currency: tier.currency,
        interval: tier.interval,
        features: tier.features,
        limits: {
          monthlyImpressions:
            tier.limits.monthlyImpressions === -1
              ? 'Unlimited'
              : tier.limits.monthlyImpressions,
          analyticsRetention:
            tier.limits.analyticsRetention === -1
              ? 'Unlimited'
              : `${tier.limits.analyticsRetention} days`,
          supportLevel: tier.limits.supportLevel,
        },
      })
    );

    res.json({
      success: true,
      data: publicTiers,
    });
  } catch (error) {
    logger.error('Failed to get subscription tiers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription tiers',
    });
  }
});

/**
 * POST /api/billing/webhook
 * Handle Stripe webhook events
 */
router.post(
  '/webhook',
  webhookRateLimit,
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    try {
      // Verify webhook signature
      const event = validateWebhookSignature(req.body, signature);

      logger.info(`Received Stripe webhook: ${event.type}`, {
        eventId: event.id,
      });

      // Process different webhook events
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event);
          break;

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event);
          break;

        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event);
          break;

        default:
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      logger.error('Webhook processing failed:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  }
);

// ========================================
// AUTHENTICATED ENDPOINTS
// ========================================

// Apply authentication middleware to all routes below
router.use(authenticateToken);

/**
 * POST /api/billing/create-customer
 * Create a new Stripe customer for the authenticated user
 */
router.post(
  '/create-customer',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2-100 characters'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = (req as any).user.userId;
      const { email, name } = req.body;

      const customer = await billingService.createCustomer(userId, email, name);

      res.json({
        success: true,
        data: {
          customerId: customer.id,
          stripeCustomerId: customer.stripeCustomerId,
        },
      });
    } catch (error) {
      logger.error('Failed to create customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create customer',
      });
    }
  }
);

/**
 * POST /api/billing/start-trial
 * Start a free trial for the authenticated user
 */
router.post('/start-trial', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const subscription = await billingService.startFreeTrial(userId);

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
      },
    });
  } catch (error) {
    logger.error('Failed to start trial:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start free trial',
    });
  }
});

/**
 * POST /api/billing/create-subscription
 * Create a new paid subscription
 */
router.post(
  '/create-subscription',
  [
    body('tier')
      .isIn(['BASIC', 'PROFESSIONAL', 'ENTERPRISE'])
      .withMessage('Valid subscription tier is required'),
    body('paymentMethodId')
      .isLength({ min: 1 })
      .withMessage('Payment method ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = (req as any).user.userId;
      const { tier, paymentMethodId } = req.body;

      const subscription = await billingService.createSubscription(
        userId,
        tier,
        paymentMethodId
      );

      res.json({
        success: true,
        data: {
          subscriptionId: subscription.id,
          status: subscription.status,
          clientSecret: (subscription as any).latest_invoice?.payment_intent
            ?.client_secret,
        },
      });
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create subscription',
      });
    }
  }
);

/**
 * PUT /api/billing/update-subscription
 * Update an existing subscription (upgrade/downgrade)
 */
router.put(
  '/update-subscription',
  [
    body('tier')
      .isIn(['BASIC', 'PROFESSIONAL', 'ENTERPRISE'])
      .withMessage('Valid subscription tier is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = (req as any).user.userId;
      const { tier } = req.body;

      const subscription = await billingService.updateSubscription(
        userId,
        tier
      );

      res.json({
        success: true,
        data: {
          subscriptionId: subscription.id,
          status: subscription.status,
        },
      });
    } catch (error) {
      logger.error('Failed to update subscription:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update subscription',
      });
    }
  }
);

/**
 * DELETE /api/billing/cancel-subscription
 * Cancel the current subscription
 */
router.delete(
  '/cancel-subscription',
  [
    query('immediately')
      .optional()
      .isBoolean()
      .withMessage('immediately must be a boolean'),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const immediately = req.query.immediately === 'true';

      const subscription = await billingService.cancelSubscription(
        userId,
        immediately
      );

      res.json({
        success: true,
        data: {
          subscriptionId: subscription.id,
          status: subscription.status,
          canceledAt: immediately ? new Date() : null,
          cancelsAt: !immediately
            ? new Date((subscription as any).current_period_end * 1000)
            : null,
        },
      });
    } catch (error) {
      logger.error('Failed to cancel subscription:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription',
      });
    }
  }
);

/**
 * GET /api/billing/subscription
 * Get current subscription data for the authenticated user
 */
router.get('/subscription', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const subscriptionData = await billingService.getSubscriptionData(userId);

    if (!subscriptionData) {
      return res.status(404).json({
        success: false,
        error: 'No active subscription found',
      });
    }

    res.json({
      success: true,
      data: subscriptionData,
    });
  } catch (error) {
    logger.error('Failed to get subscription data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription data',
    });
  }
});

/**
 * POST /api/billing/track-usage
 * Track usage for the authenticated user
 */
router.post(
  '/track-usage',
  [
    body('impressions')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Impressions must be a non-negative integer'),
    body('qualifiedClicks')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Qualified clicks must be a non-negative integer'),
    body('apiCalls')
      .optional()
      .isInt({ min: 0 })
      .withMessage('API calls must be a non-negative integer'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = (req as any).user.userId;
      const { impressions = 0, qualifiedClicks = 0, apiCalls = 0 } = req.body;

      await billingService.trackUsage(
        userId,
        impressions,
        qualifiedClicks,
        apiCalls
      );

      res.json({
        success: true,
        message: 'Usage tracked successfully',
      });
    } catch (error) {
      logger.error('Failed to track usage:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track usage',
      });
    }
  }
);

/**
 * GET /api/billing/usage/:month?
 * Get usage data for a specific month (defaults to current month)
 */
router.get(
  '/usage/:month?',
  [
    param('month')
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage('Month must be in YYYY-MM format'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = (req as any).user.userId;
      const month = req.params.month || new Date().toISOString().slice(0, 7);

      // This would be a method to get usage (implement in BillingService)
      const overageCharges = await billingService.calculateOverageCharges(
        userId,
        month
      );

      res.json({
        success: true,
        data: {
          month,
          overageCharges,
          currency: 'EUR',
        },
      });
    } catch (error) {
      logger.error('Failed to get usage data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve usage data',
      });
    }
  }
);

// ========================================
// WEBHOOK EVENT HANDLERS
// ========================================

async function handleSubscriptionCreated(event: any) {
  logger.info('Processing subscription.created webhook', {
    subscriptionId: event.data.object.id,
  });
  // Implementation for subscription created
}

async function handleSubscriptionUpdated(event: any) {
  logger.info('Processing subscription.updated webhook', {
    subscriptionId: event.data.object.id,
  });
  // Implementation for subscription updated
}

async function handleSubscriptionDeleted(event: any) {
  logger.info('Processing subscription.deleted webhook', {
    subscriptionId: event.data.object.id,
  });
  // Implementation for subscription deleted
}

async function handleInvoicePaymentSucceeded(event: any) {
  logger.info('Processing invoice.payment_succeeded webhook', {
    invoiceId: event.data.object.id,
  });
  // Implementation for successful payment
}

async function handleInvoicePaymentFailed(event: any) {
  logger.info('Processing invoice.payment_failed webhook', {
    invoiceId: event.data.object.id,
  });
  // Implementation for failed payment
}

export default router;
