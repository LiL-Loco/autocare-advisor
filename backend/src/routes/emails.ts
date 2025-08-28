import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/adminAuth';
import { EmailTemplate } from '../models/Email';
import { BrevoEmailService } from '../services/brevoEmailService';

const router = Router();

// Initialize Brevo service
let brevoService: BrevoEmailService;
try {
  brevoService = new BrevoEmailService({
    apiKey: process.env.BREVO_API_KEY || 'demo-api-key',
  });
  console.log('[Email API] Brevo service initialized successfully');
} catch (error) {
  console.error('[Email API] Failed to initialize Brevo service:', error);
}

// ============================================================================
// TRANSACTIONAL EMAIL ROUTES
// ============================================================================

/**
 * Send transactional email using template
 */
router.post(
  '/send-template',
  [
    body('templateId').notEmpty().withMessage('Template ID is required'),
    body('recipientEmail')
      .isEmail()
      .withMessage('Valid recipient email is required'),
    body('recipientName').optional().isString(),
    body('variables').optional().isObject(),
    body('options').optional().isObject(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const {
        templateId,
        recipientEmail,
        recipientName,
        variables = {},
        options = {},
      } = req.body;

      const result = await brevoService.sendTemplateEmail(
        templateId,
        recipientEmail,
        recipientName,
        variables,
        options
      );

      res.json({
        success: result.success,
        data: result.success
          ? {
              messageId: result.messageId,
              externalId: result.externalId,
            }
          : null,
        error: result.error,
      });
    } catch (error) {
      console.error('[Email API] Failed to send template email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send email',
      });
    }
  }
);

/**
 * Send custom transactional email
 */
router.post(
  '/send',
  [
    body('to').isArray().withMessage('Recipients array is required'),
    body('to.*.email').isEmail().withMessage('Valid email addresses required'),
    body('subject').optional().isString(),
    body('htmlContent').optional().isString(),
    body('textContent').optional().isString(),
    body('templateId').optional().isNumeric(),
    body('params').optional().isObject(),
    body('tags').optional().isArray(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const result = await brevoService.sendTransactionalEmail(req.body);

      res.json({
        success: result.success,
        data: result.success
          ? {
              messageId: result.messageId,
              externalId: result.externalId,
            }
          : null,
        error: result.error,
      });
    } catch (error) {
      console.error('[Email API] Failed to send transactional email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send email',
      });
    }
  }
);

/**
 * Send batch emails
 */
router.post(
  '/send-batch',
  [
    body('emails').isArray().withMessage('Emails array is required'),
    body('emails.*.to')
      .isArray()
      .withMessage('Recipients array required for each email'),
    body('emails.*.to.*.email')
      .isEmail()
      .withMessage('Valid email addresses required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { emails } = req.body;

      const results = await brevoService.sendBatchEmails(emails);

      const successful = results.filter((r: any) => r.success).length;
      const failed = results.filter((r: any) => !r.success).length;

      res.json({
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            successful,
            failed,
            successRate:
              results.length > 0 ? (successful / results.length) * 100 : 0,
          },
        },
      });
    } catch (error) {
      console.error('[Email API] Failed to send batch emails:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send batch emails',
      });
    }
  }
);

// ============================================================================
// TEMPLATE MANAGEMENT ROUTES (Admin only)
// ============================================================================

/**
 * Get all email templates
 */
router.get('/templates', requireAdmin, async (req: Request, res: Response) => {
  try {
    const templates = await EmailTemplate.find()
      .select('-htmlContent -textContent')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { templates },
    });
  } catch (error) {
    console.error('[Email API] Failed to get templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve templates',
    });
  }
});

/**
 * Get single template with content
 */
router.get(
  '/templates/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const template = await EmailTemplate.findById(req.params.id);
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      }

      res.json({
        success: true,
        data: { template },
      });
    } catch (error) {
      console.error('[Email API] Failed to get template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve template',
      });
    }
  }
);

/**
 * Create new email template
 */
router.post(
  '/templates',
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Template name is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('htmlContent').notEmpty().withMessage('HTML content is required'),
    body('templateType').notEmpty().withMessage('Template type is required'),
    body('templateCategory').optional().isString(),
    body('variables').optional().isArray(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const template = new EmailTemplate(req.body);
      await template.save();

      // Optionally sync with Brevo
      if (req.body.syncWithBrevo) {
        try {
          const brevoResult = await brevoService.createBrevoTemplate(
            template._id.toString()
          );

          if (brevoResult.success && brevoResult.brevoTemplateId) {
            // Note: brevoTemplateId would need to be added to EmailTemplate schema
            console.log(
              'Template synced with Brevo, ID:',
              brevoResult.brevoTemplateId
            );
          }
        } catch (error) {
          console.warn(
            '[Email API] Failed to sync template with Brevo:',
            error
          );
        }
      }

      res.status(201).json({
        success: true,
        data: { template },
      });
    } catch (error) {
      console.error('[Email API] Failed to create template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create template',
      });
    }
  }
);

/**
 * Update email template
 */
router.put(
  '/templates/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const template = await EmailTemplate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      }

      res.json({
        success: true,
        data: { template },
      });
    } catch (error) {
      console.error('[Email API] Failed to update template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update template',
      });
    }
  }
);

/**
 * Delete email template
 */
router.delete(
  '/templates/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const template = await EmailTemplate.findByIdAndDelete(req.params.id);
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      }

      res.json({
        success: true,
        data: { message: 'Template deleted successfully' },
      });
    } catch (error) {
      console.error('[Email API] Failed to delete template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete template',
      });
    }
  }
);

/**
 * Preview template with variables
 */
router.post(
  '/templates/:id/preview',
  requireAdmin,
  [body('variables').optional().isObject()],
  async (req: Request, res: Response) => {
    try {
      const template = await EmailTemplate.findById(req.params.id);
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      }

      const variables = req.body.variables || {};
      const rendered = await template.renderTemplate(variables);

      res.json({
        success: true,
        data: {
          rendered,
          variables: template.variables,
        },
      });
    } catch (error) {
      console.error('[Email API] Failed to preview template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to preview template',
      });
    }
  }
);

// ============================================================================
// CONTACT MANAGEMENT ROUTES
// ============================================================================

/**
 * Add contact to Brevo
 */
router.post(
  '/contacts',
  requireAdmin,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('attributes').optional().isObject(),
    body('listIds').optional().isArray(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const result = await brevoService.upsertContact(req.body);

      res.json({
        success: result.success,
        error: result.error,
      });
    } catch (error) {
      console.error('[Email API] Failed to add contact:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add contact',
      });
    }
  }
);

// ============================================================================
// CAMPAIGN MANAGEMENT ROUTES (Admin only)
// ============================================================================

/**
 * Create email campaign
 */
router.post(
  '/campaigns',
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Campaign name is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('listIds').isArray().withMessage('List IDs array is required'),
    body('templateId').optional().isNumeric(),
    body('htmlContent').optional().isString(),
    body('textContent').optional().isString(),
    body('scheduledAt').optional().isISO8601(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const campaignData = {
        ...req.body,
        scheduledAt: req.body.scheduledAt
          ? new Date(req.body.scheduledAt)
          : undefined,
      };

      const result = await brevoService.createCampaign(campaignData);

      res.json({
        success: result.success,
        data: result.success ? { campaignId: result.campaignId } : null,
        error: result.error,
      });
    } catch (error) {
      console.error('[Email API] Failed to create campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create campaign',
      });
    }
  }
);

/**
 * Get campaign statistics
 */
router.get(
  '/campaigns/:id/stats',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.id);
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID',
        });
      }

      const stats = await brevoService.getCampaignStats(campaignId);

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      console.error('[Email API] Failed to get campaign stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve campaign statistics',
      });
    }
  }
);

// ============================================================================
// WEBHOOK ROUTES
// ============================================================================

/**
 * Handle Brevo webhooks
 */
router.post('/webhooks/brevo', async (req, res) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];

    for (const event of events) {
      await brevoService.processWebhookEvent(event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Email API] Failed to process webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook',
    });
  }
});

// ============================================================================
// UTILITY ROUTES
// ============================================================================

/**
 * Test Brevo connection
 */
router.get(
  '/test-connection',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const result = await brevoService.testConnection();

      let accountInfo = null;
      if (result.success) {
        accountInfo = await brevoService.getAccountInfo();
      }

      res.json({
        success: result.success,
        data: accountInfo,
        error: result.error,
      });
    } catch (error) {
      console.error('[Email API] Failed to test connection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test connection',
      });
    }
  }
);

/**
 * Get email sending statistics
 */
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    const EmailLog = (await import('../models/Email.js')).EmailLog;

    // Get aggregated statistics
    const stats = await EmailLog.aggregate([
      ...(Object.keys(dateFilter).length > 0
        ? [{ $match: { sentAt: dateFilter } }]
        : []),
      {
        $group: {
          _id: null,
          totalSent: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
          },
          opened: { $sum: { $cond: [{ $ne: ['$openedAt', null] }, 1, 0] } },
          clicked: { $sum: { $cond: [{ $gt: ['$clickCount', 0] }, 1, 0] } },
          bounced: { $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          unsubscribed: {
            $sum: { $cond: [{ $ne: ['$unsubscribedAt', null] }, 1, 0] },
          },
          totalClicks: { $sum: '$clickCount' },
          uniqueClicks: { $sum: '$uniqueClickCount' },
        },
      },
    ]);

    const data = stats[0] || {
      totalSent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      failed: 0,
      unsubscribed: 0,
      totalClicks: 0,
      uniqueClicks: 0,
    };

    // Calculate rates
    const sent = data.totalSent;
    const rates = {
      deliveryRate: sent > 0 ? (data.delivered / sent) * 100 : 0,
      openRate: sent > 0 ? (data.opened / sent) * 100 : 0,
      clickRate: sent > 0 ? (data.clicked / sent) * 100 : 0,
      bounceRate: sent > 0 ? (data.bounced / sent) * 100 : 0,
      unsubscribeRate: sent > 0 ? (data.unsubscribed / sent) * 100 : 0,
    };

    res.json({
      success: true,
      data: {
        ...data,
        rates,
      },
    });
  } catch (error) {
    console.error('[Email API] Failed to get email stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve email statistics',
    });
  }
});

export default router;
