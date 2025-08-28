/**
 * Brevo Email Routes - AutoCare Advisor
 *
 * API endpoints for email functionality
 */

import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { EmailLog, EmailTemplate, EmailUnsubscribe } from '../models/Email';
import {
  BrevoWebhookEvent,
  createBrevoService,
  getBrevoService,
} from '../services/brevoEmailService';

const router = express.Router();

// Helper for express-validator-style validation
const validateRequest = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Send a transactional email
 * POST /api/email/send
 */
router.post(
  '/send',
  [
    authenticateToken,
    body('to').isEmail().normalizeEmail(),
    body('toName').optional().isString().trim(),
    body('subject').isString().trim().notEmpty(),
    body('htmlContent').isString().notEmpty(),
    body('textContent').optional().isString(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const brevoService = getBrevoService();
      const { to, toName, subject, htmlContent, textContent } = req.body;

      const result = await brevoService.sendTransactionalEmail({
        to: [{ email: to, name: toName }],
        subject,
        htmlContent,
        textContent,
        sender: {
          email: process.env.FROM_EMAIL || 'noreply@autocare-advisor.com',
          name: process.env.FROM_NAME || 'AutoCare Advisor',
        },
      });

      res.json({
        success: result.success,
        data: { messageId: result.messageId },
        message: result.success ? 'Email sent successfully' : result.error,
      });
    } catch (error) {
      console.error('[Email] Send error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
      });
    }
  }
);

/**
 * Send template email
 * POST /api/email/send-template
 */
router.post(
  '/send-template',
  [
    authenticateToken,
    body('to').isEmail().normalizeEmail(),
    body('toName').optional().isString().trim(),
    body('templateId').isString().notEmpty(),
    body('variables').optional().isObject(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const brevoService = getBrevoService();
      const { to, toName, templateId, variables = {} } = req.body;

      const result = await brevoService.sendTemplateEmail(
        templateId,
        to,
        toName || '',
        variables
      );

      res.json({
        success: result.success,
        data: { messageId: result.messageId },
        message: result.success ? 'Email sent successfully' : result.error,
      });
    } catch (error) {
      console.error('[Email] Template send error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send template email',
      });
    }
  }
);

/**
 * Get email templates
 * GET /api/email/templates
 */
router.get(
  '/templates',
  [
    authenticateToken,
    query('type')
      .optional()
      .isIn([
        'onboarding',
        'marketing',
        'transactional',
        'nurturing',
        'notification',
      ]),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      const filter: any = { isActive: true };

      if (type) filter.templateType = type;

      const templates = await EmailTemplate.find(filter).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        data: { templates },
        message: `Found ${templates.length} templates`,
      });
    } catch (error) {
      console.error('[Email] Template fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
      });
    }
  }
);

/**
 * Create email template
 * POST /api/email/templates
 */
router.post(
  '/templates',
  [
    authenticateToken,
    requireAdmin,
    body('name').isString().trim().notEmpty(),
    body('subject').isString().trim().notEmpty(),
    body('htmlContent').isString().notEmpty(),
    body('templateType').isIn([
      'onboarding',
      'marketing',
      'transactional',
      'nurturing',
      'notification',
    ]),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const templateData = {
        ...req.body,
        createdBy: req.user?.userId,
      };

      const template = new EmailTemplate(templateData);
      await template.save();

      res.status(201).json({
        success: true,
        data: { template },
        message: 'Template created successfully',
      });
    } catch (error) {
      console.error('[Email] Template creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create template',
      });
    }
  }
);

/**
 * Get email analytics
 * GET /api/email/analytics
 */
router.get(
  '/analytics',
  [
    authenticateToken,
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const filter: any = {};

      if (startDate || endDate) {
        filter.sentAt = {};
        if (startDate) filter.sentAt.$gte = new Date(startDate as string);
        if (endDate) filter.sentAt.$lte = new Date(endDate as string);
      }

      // Aggregate analytics data
      const stats = await EmailLog.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalSent: { $sum: 1 },
            delivered: {
              $sum: { $cond: [{ $ne: ['$deliveredAt', null] }, 1, 0] },
            },
            opened: { $sum: { $cond: [{ $ne: ['$openedAt', null] }, 1, 0] } },
            clicked: {
              $sum: { $cond: [{ $ne: ['$firstClickedAt', null] }, 1, 0] },
            },
            bounced: { $sum: { $cond: [{ $ne: ['$bouncedAt', null] }, 1, 0] } },
          },
        },
      ]);

      const result = stats[0] || {
        totalSent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
      };

      const totalSent = result.totalSent || 0;

      const analytics = {
        ...result,
        deliveryRate:
          totalSent > 0 ? ((result.delivered / totalSent) * 100).toFixed(2) : 0,
        openRate:
          totalSent > 0 ? ((result.opened / totalSent) * 100).toFixed(2) : 0,
        clickRate:
          totalSent > 0 ? ((result.clicked / totalSent) * 100).toFixed(2) : 0,
      };

      res.json({
        success: true,
        data: { analytics },
        message: 'Analytics retrieved successfully',
      });
    } catch (error) {
      console.error('[Email] Analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics',
      });
    }
  }
);

/**
 * Unsubscribe endpoint
 * POST /api/email/unsubscribe
 */
router.post(
  '/unsubscribe',
  [
    body('email').isEmail().normalizeEmail(),
    body('type')
      .optional()
      .isIn(['all', 'marketing', 'transactional', 'notifications']),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, type = 'all' } = req.body;

      const unsubscribe = new EmailUnsubscribe({
        email,
        unsubscribeType: type,
        campaignTypes: [type],
        source: 'user_request',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      await unsubscribe.save();

      res.json({
        success: true,
        message: 'Successfully unsubscribed',
      });
    } catch (error) {
      console.error('[Email] Unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe',
      });
    }
  }
);

/**
 * Handle Brevo webhooks
 * POST /api/email/webhook/brevo
 */
router.post('/webhook/brevo', async (req: Request, res: Response) => {
  try {
    const events: BrevoWebhookEvent[] = Array.isArray(req.body)
      ? req.body
      : [req.body];
    const brevoService = getBrevoService();

    for (const event of events) {
      await brevoService.processWebhookEvent(event);
    }

    res.json({
      success: true,
      data: { processed: events.length },
    });
  } catch (error) {
    console.error('[Email] Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
    });
  }
});

/**
 * Test email service connection
 * GET /api/email/health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    createBrevoService();
    const brevoService = getBrevoService();
    const connectionTest = await brevoService.testConnection();

    res.json({
      success: connectionTest.success,
      message: connectionTest.success
        ? 'Brevo email service is healthy'
        : connectionTest.error,
    });
  } catch (error) {
    console.error('[Email] Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Email service not configured',
    });
  }
});

export default router;
