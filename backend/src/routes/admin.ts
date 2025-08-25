import { Request, Response, Router } from 'express';
import Joi from 'joi';
import { requireAdmin } from '../middleware/adminAuth';
import { authenticateToken } from '../middleware/auth';
import {
  cancelInvitation,
  cleanupExpiredInvitations,
  createInvitation,
  CreateInvitationData,
  getInvitationById,
  getInvitationsByStatus,
  resendInvitation,
} from '../services/invitationService';
import logger from '../utils/logger';

const router = Router();

// Apply authentication and admin check to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * Validation schema for creating invitations
 */
const createInvitationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  role: Joi.string().valid('partner', 'customer').required().messages({
    'any.only': 'Role must be either partner or customer',
    'any.required': 'Role is required',
  }),

  company_name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Company name must be at least 2 characters long',
    'string.max': 'Company name must not exceed 255 characters',
    'any.required': 'Company name is required',
  }),

  contact_person: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Contact person must be at least 2 characters long',
    'string.max': 'Contact person must not exceed 255 characters',
    'any.required': 'Contact person is required',
  }),

  first_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 100 characters',
    'any.required': 'First name is required',
  }),

  last_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 100 characters',
    'any.required': 'Last name is required',
  }),

  phone: Joi.string().min(5).max(50).optional().messages({
    'string.min': 'Phone must be at least 5 characters long',
    'string.max': 'Phone must not exceed 50 characters',
  }),

  expires_in_days: Joi.number().integer().min(1).max(30).default(7).messages({
    'number.base': 'Expires in days must be a number',
    'number.min': 'Expires in days must be at least 1',
    'number.max': 'Expires in days must not exceed 30',
  }),

  metadata: Joi.object().optional(),
});

/**
 * POST /admin/invitations - Create new invitation
 */
router.post('/invitations', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = createInvitationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    // Create invitation with admin's ID
    const invitationData: CreateInvitationData = {
      ...value,
      invited_by: req.user.userId,
    };

    const invitation = await createInvitation(invitationData, req.user.userId);

    // TODO: Send invitation email here
    logger.info(
      `Admin ${req.user.email} created invitation for ${invitation.email}`
    );

    res.status(201).json({
      message: 'Invitation created successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        company_name: invitation.company_name,
        contact_person: invitation.contact_person,
        expires_at: invitation.expires_at,
        status: invitation.status,
        created_at: invitation.created_at,
      },
    });
  } catch (error: any) {
    logger.error('Error creating invitation:', error);

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'Invitation creation failed',
        message: error.message,
      });
    }

    res.status(500).json({
      error: 'Invitation creation failed',
      message: 'An error occurred while creating the invitation',
    });
  }
});

/**
 * GET /admin/invitations - List all invitations with optional status filter
 */
router.get('/invitations', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as
      | 'pending'
      | 'accepted'
      | 'expired'
      | 'cancelled'
      | undefined;

    // Validate status parameter if provided
    if (
      status &&
      !['pending', 'accepted', 'expired', 'cancelled'].includes(status)
    ) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, accepted, expired, cancelled',
      });
    }

    const invitations = await getInvitationsByStatus(status);

    res.json({
      invitations: invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        company_name: invitation.company_name,
        contact_person: invitation.contact_person,
        phone: invitation.phone,
        status: invitation.status,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at,
        updated_at: invitation.updated_at,
        inviter: {
          first_name: (invitation as any).inviter_first_name,
          last_name: (invitation as any).inviter_last_name,
        },
      })),
      total: invitations.length,
      status_filter: status || 'all',
    });
  } catch (error) {
    logger.error('Error fetching invitations:', error);
    res.status(500).json({
      error: 'Failed to fetch invitations',
      message: 'An error occurred while fetching invitations',
    });
  }
});

/**
 * GET /admin/invitations/:id - Get invitation by ID
 */
router.get('/invitations/:id', async (req: Request, res: Response) => {
  try {
    const invitationId = req.params.id;

    if (!invitationId) {
      return res.status(400).json({
        error: 'Invalid invitation ID',
      });
    }

    const invitation = await getInvitationById(invitationId);

    if (!invitation) {
      return res.status(404).json({
        error: 'Invitation not found',
      });
    }

    res.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        company_name: invitation.company_name,
        contact_person: invitation.contact_person,
        phone: invitation.phone,
        status: invitation.status,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at,
        updated_at: invitation.updated_at,
        metadata: invitation.metadata,
        inviter: {
          first_name: (invitation as any).inviter_first_name,
          last_name: (invitation as any).inviter_last_name,
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching invitation:', error);
    res.status(500).json({
      error: 'Failed to fetch invitation',
      message: 'An error occurred while fetching the invitation',
    });
  }
});

/**
 * PUT /admin/invitations/:id/resend - Resend invitation
 */
router.put('/invitations/:id/resend', async (req: Request, res: Response) => {
  try {
    const invitationId = req.params.id;

    if (!invitationId) {
      return res.status(400).json({
        error: 'Invalid invitation ID',
      });
    }

    const invitation = await resendInvitation(invitationId);

    // TODO: Send invitation email here
    logger.info(`Admin ${req.user?.email} resent invitation ${invitationId}`);

    res.json({
      message: 'Invitation resent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expires_at: invitation.expires_at,
        status: invitation.status,
        updated_at: invitation.updated_at,
      },
    });
  } catch (error: any) {
    logger.error('Error resending invitation:', error);

    if (error.message === 'Invitation not found') {
      return res.status(404).json({
        error: 'Invitation not found',
      });
    }

    res.status(500).json({
      error: 'Failed to resend invitation',
      message: 'An error occurred while resending the invitation',
    });
  }
});

/**
 * DELETE /admin/invitations/:id - Cancel invitation
 */
router.delete('/invitations/:id', async (req: Request, res: Response) => {
  try {
    const invitationId = req.params.id;

    if (!invitationId) {
      return res.status(400).json({
        error: 'Invalid invitation ID',
      });
    }

    const cancelled = await cancelInvitation(invitationId);

    if (!cancelled) {
      return res.status(404).json({
        error: 'Invitation not found or cannot be cancelled',
        message: 'Invitation may already be accepted or cancelled',
      });
    }

    logger.info(
      `Admin ${req.user?.email} cancelled invitation ${invitationId}`
    );

    res.json({
      message: 'Invitation cancelled successfully',
    });
  } catch (error) {
    logger.error('Error cancelling invitation:', error);
    res.status(500).json({
      error: 'Failed to cancel invitation',
      message: 'An error occurred while cancelling the invitation',
    });
  }
});

/**
 * POST /admin/invitations/cleanup - Clean up expired invitations
 */
router.post('/invitations/cleanup', async (req: Request, res: Response) => {
  try {
    const cleanedCount = await cleanupExpiredInvitations();

    logger.info(
      `Admin ${req.user?.email} triggered cleanup of ${cleanedCount} expired invitations`
    );

    res.json({
      message: 'Cleanup completed successfully',
      cleaned_invitations: cleanedCount,
    });
  } catch (error) {
    logger.error('Error cleaning up invitations:', error);
    res.status(500).json({
      error: 'Cleanup failed',
      message: 'An error occurred while cleaning up expired invitations',
    });
  }
});

export default router;
