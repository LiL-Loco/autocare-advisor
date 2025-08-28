import { Request, Response, Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  validate,
} from '../middleware/validation';
import {
  createUser,
  createUserSession,
  findUserByEmail,
  findUserById,
  findValidSession,
  invalidateAllUserSessions,
  invalidateSession,
  updateLastLogin,
  updatePasswordResetToken,
} from '../services/userService';
import {
  generatePasswordResetToken,
  generateTokenPair,
  hashPassword,
  JWTPayload,
  verifyPassword,
  verifyRefreshToken,
} from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * POST /auth/register - User Registration (DISABLED for public - Admin only)
 */
router.post(
  '/register',
  authenticateToken, // Require authentication
  validate(registerSchema),
  async (req: Request, res: Response) => {
    try {
      // Only allow admin users to register new accounts
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access denied',
          message:
            'Public registration is disabled. New users must be invited by an administrator.',
        });
      }

      const { email, password, firstName, lastName, role } = req.body;

      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'An account with this email address already exists',
        });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await createUser({
        email,
        password_hash: passwordHash,
        role: role || 'customer',
        first_name: firstName,
        last_name: lastName,
      });

      // Generate tokens
      const payload: JWTPayload = {
        userId: user.id,
        id: user.id, // Alias for userId
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      };
      const tokens = generateTokenPair(payload);

      // Create session for refresh token
      await createUserSession(
        user.id,
        tokens.refreshToken,
        { userAgent: req.headers['user-agent'] },
        req.ip
      );

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isEmailVerified: user.is_email_verified,
        },
        tokens,
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: 'An error occurred during registration',
      });
    }
  }
);

/**
 * POST /auth/login - User Login
 */
router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password, rememberMe } = req.body;

      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Verify password
      const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          error: 'Account disabled',
          message: 'Your account has been disabled. Please contact support.',
        });
      }

      // Generate tokens
      const payload: JWTPayload = {
        userId: user.id,
        id: user.id, // Alias for userId
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      };
      const tokens = generateTokenPair(payload);

      // Create session for refresh token
      await createUserSession(
        user.id,
        tokens.refreshToken,
        { userAgent: req.headers['user-agent'], rememberMe },
        req.ip
      );

      // Update last login
      await updateLastLogin(user.id);

      logger.info(`User logged in: ${email}`);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isEmailVerified: user.is_email_verified,
          lastLogin: new Date(),
        },
        tokens,
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred during login',
      });
    }
  }
);

/**
 * POST /auth/admin/login - Admin Login (Enhanced Security)
 */
router.post(
  '/admin/login',
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password, rememberMe } = req.body;

      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Verify password
      const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Enhanced Admin Validation
      if (user.role !== 'admin') {
        logger.warn(`Non-admin login attempt via admin endpoint: ${email}`);
        return res.status(403).json({
          error: 'Access denied',
          message: 'Admin access required',
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          error: 'Account disabled',
          message: 'Your account has been disabled. Please contact support.',
        });
      }

      // Generate tokens with userType claim
      const payload: JWTPayload = {
        userId: user.id,
        id: user.id, // Alias for userId
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
        userType: 'admin', // Enhanced JWT claim for admin login
      };
      const tokens = generateTokenPair(payload);

      // Create session for refresh token
      await createUserSession(
        user.id,
        tokens.refreshToken,
        {
          userAgent: req.headers['user-agent'],
          rememberMe,
          loginType: 'admin',
        },
        req.ip
      );

      // Update last login
      await updateLastLogin(user.id);

      logger.info(`Admin logged in: ${email}`);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isEmailVerified: user.is_email_verified,
          lastLogin: new Date(),
          userType: 'admin',
        },
        tokens,
      });
    } catch (error) {
      logger.error('Admin login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred during login',
      });
    }
  }
);

/**
 * POST /auth/partner/login - Partner Login (Enhanced Security)
 */
router.post(
  '/partner/login',
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password, rememberMe } = req.body;

      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Verify password
      const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Enhanced Partner Validation
      if (user.role !== 'partner') {
        logger.warn(`Non-partner login attempt via partner endpoint: ${email}`);
        return res.status(403).json({
          error: 'Access denied',
          message: 'Partner access required',
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          error: 'Account disabled',
          message: 'Your account has been disabled. Please contact support.',
        });
      }

      // Generate tokens with userType claim
      const payload: JWTPayload = {
        userId: user.id,
        id: user.id, // Alias for userId
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
        userType: 'partner', // Enhanced JWT claim for partner login
      };
      const tokens = generateTokenPair(payload);

      // Create session for refresh token
      await createUserSession(
        user.id,
        tokens.refreshToken,
        {
          userAgent: req.headers['user-agent'],
          rememberMe,
          loginType: 'partner',
        },
        req.ip
      );

      // Update last login
      await updateLastLogin(user.id);

      logger.info(`Partner logged in: ${email}`);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isEmailVerified: user.is_email_verified,
          lastLogin: new Date(),
          userType: 'partner',
        },
        tokens,
      });
    } catch (error) {
      logger.error('Partner login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred during login',
      });
    }
  }
);

/**
 * POST /auth/refresh - Refresh Access Token
 */
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token format
      if (!verifyRefreshToken(refreshToken)) {
        return res.status(401).json({
          error: 'Invalid refresh token',
          message: 'The provided refresh token is invalid',
        });
      }

      // Find valid session
      const session = await findValidSession(refreshToken);
      if (!session) {
        return res.status(401).json({
          error: 'Invalid refresh token',
          message: 'Refresh token not found or expired',
        });
      }

      // Get user data
      const user = await findUserById(session.user_id);
      if (!user || !user.is_active) {
        return res.status(401).json({
          error: 'User not found',
          message: 'User associated with this token not found or inactive',
        });
      }

      // Generate new tokens
      const payload: JWTPayload = {
        userId: user.id,
        id: user.id, // Alias for userId
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      };
      const newTokens = generateTokenPair(payload);

      // Invalidate old session and create new one
      await invalidateSession(refreshToken);
      await createUserSession(
        user.id,
        newTokens.refreshToken,
        session.device_info,
        req.ip
      );

      res.json({
        message: 'Tokens refreshed successfully',
        tokens: newTokens,
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({
        error: 'Token refresh failed',
        message: 'An error occurred while refreshing tokens',
      });
    }
  }
);

/**
 * POST /auth/logout - User Logout
 */
router.post(
  '/logout',
  validate(refreshTokenSchema),
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Invalidate the session
      await invalidateSession(refreshToken);

      res.json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout',
      });
    }
  }
);

/**
 * POST /auth/logout-all - Logout from all devices
 */
router.post(
  '/logout-all',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      // Invalidate all user sessions
      await invalidateAllUserSessions(req.user.userId);

      res.json({
        message: 'Logged out from all devices successfully',
      });
    } catch (error) {
      logger.error('Logout all error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout',
      });
    }
  }
);

/**
 * POST /auth/forgot-password - Request Password Reset
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Generate reset token
      const resetToken = generatePasswordResetToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

      // Update user with reset token
      const updated = await updatePasswordResetToken(
        email,
        resetToken,
        expiresAt
      );

      if (!updated) {
        // Don't reveal if email exists or not for security
        return res.json({
          message:
            'If an account with this email exists, a password reset link has been sent.',
        });
      }

      // TODO: Send email with reset link
      logger.info(`Password reset requested for: ${email}`);

      res.json({
        message:
          'If an account with this email exists, a password reset link has been sent.',
        // For development only - remove in production
        resetToken:
          process.env.NODE_ENV === 'development' ? resetToken : undefined,
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Password reset request failed',
        message: 'An error occurred while processing your request',
      });
    }
  }
);

/**
 * GET /auth/me - Get Current User
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        isEmailVerified: user.is_email_verified,
        lastLogin: user.last_login,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      message: 'An error occurred while retrieving user profile',
    });
  }
});

export default router;
