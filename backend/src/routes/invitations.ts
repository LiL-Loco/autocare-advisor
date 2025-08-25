import { Request, Response, Router } from 'express';
import Joi from 'joi';
import {
  acceptInvitationAndCreateUser,
  validateInvitationToken,
} from '../services/invitationService';
import { createUserSession } from '../services/userService';
import { generateTokenPair, hashPassword, JWTPayload } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * Validation schema for accepting invitations
 */
const acceptInvitationSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required',
  }),
});

/**
 * GET /invitations/:token/validate - Validate invitation token and return invitation details
 */
router.get('/:token/validate', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Invitation token is required',
      });
    }

    const invitation = await validateInvitationToken(token);

    if (!invitation) {
      return res.status(404).json({
        error: 'Invalid invitation',
        message: 'Invitation not found, expired, or already used',
      });
    }

    // Extract admin-provided data from metadata
    const adminData =
      typeof invitation.metadata === 'string'
        ? JSON.parse(invitation.metadata)
        : invitation.metadata || {};

    // Return invitation details (excluding sensitive data)
    res.json({
      valid: true,
      invitation: {
        email: invitation.email,
        role: invitation.role,
        company_name: invitation.company_name,
        contact_person: invitation.contact_person,
        phone: invitation.phone,
        expires_at: invitation.expires_at,
        // Pre-filled user data from admin
        first_name: adminData.first_name,
        last_name: adminData.last_name,
      },
    });
  } catch (error) {
    logger.error('Error validating invitation token:', error);
    res.status(500).json({
      error: 'Validation failed',
      message: 'An error occurred while validating the invitation',
    });
  }
});

/**
 * POST /invitations/:token/accept - Accept invitation and create user account
 */
router.post('/:token/accept', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Invitation token is required',
      });
    }

    // Validate request body
    const { error, value } = acceptInvitationSchema.validate(req.body, {
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

    // Hash the password
    const passwordHash = await hashPassword(value.password);

    // Accept invitation and create user with admin-provided data
    const { user, invitation } = await acceptInvitationAndCreateUser(
      token,
      passwordHash
    );

    // Generate authentication tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
    };
    const tokens = generateTokenPair(payload);

    // Create session for refresh token
    await createUserSession(
      user.id,
      tokens.refreshToken,
      { userAgent: req.headers['user-agent'], invitationAccepted: true },
      req.ip
    );

    logger.info(`Invitation accepted and user created: ${user.email}`, {
      userId: user.id,
      invitationId: invitation.id,
      role: user.role,
      company: invitation.company_name,
    });

    // Return user data and tokens (user is automatically logged in)
    res.status(201).json({
      message: 'Invitation accepted successfully. Welcome to AutoCare Advisor!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        isEmailVerified: user.is_email_verified,
        createdAt: user.created_at,
        company_name: invitation.company_name,
      },
      tokens,
      onboarding_complete: true,
    });
  } catch (error: any) {
    logger.error('Error accepting invitation:', error);

    if (error.message.includes('Invalid or expired')) {
      return res.status(404).json({
        error: 'Invalid invitation',
        message: error.message,
      });
    }

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'Account creation failed',
        message: 'An account with this email already exists',
      });
    }

    res.status(500).json({
      error: 'Invitation acceptance failed',
      message: 'An error occurred while processing your invitation',
    });
  }
});

export default router;
