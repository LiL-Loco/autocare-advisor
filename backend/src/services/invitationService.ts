import crypto from 'crypto';
import logger from '../utils/logger';
import pool from './userService';

export interface Invitation {
  id: string;
  email: string;
  invitation_token: string;
  role: 'admin' | 'partner' | 'customer';
  invited_by: string;
  expires_at: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  company_name?: string;
  contact_person?: string;
  phone?: string;
  metadata?: object;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInvitationData {
  email: string;
  role: 'partner' | 'customer';
  company_name: string;
  contact_person: string;
  phone?: string;
  invited_by: string; // Must be admin
  expires_in_days?: number;
  metadata?: object;
  // Admin pre-fills all user data
  first_name: string;
  last_name: string;
}

/**
 * Generate a cryptographically secure invitation token
 */
export const generateInvitationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a new invitation (Admin only)
 */
export const createInvitation = async (
  invitationData: CreateInvitationData,
  adminUserId: string
): Promise<Invitation> => {
  const client = await pool.connect();
  try {
    // Verify that the inviting user is an admin
    const adminCheckQuery =
      'SELECT role FROM users WHERE id = $1 AND is_active = true';
    const adminCheck = await client.query(adminCheckQuery, [adminUserId]);

    if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
      throw new Error('Only admin users can create invitations');
    }

    // Check if user with email already exists
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await client.query(existingUserQuery, [
      invitationData.email,
    ]);

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Check if pending invitation already exists
    const existingInvitationQuery = `
      SELECT id FROM user_invitations 
      WHERE email = $1 AND status = 'pending' AND expires_at > NOW()
    `;
    const existingInvitation = await client.query(existingInvitationQuery, [
      invitationData.email,
    ]);

    if (existingInvitation.rows.length > 0) {
      throw new Error('Pending invitation for this email already exists');
    }

    // Generate invitation token
    const invitationToken = generateInvitationToken();

    // Calculate expiration date
    const expiresInDays = invitationData.expires_in_days || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create invitation with all admin-provided data
    const query = `
      INSERT INTO user_invitations (
        email, invitation_token, role, invited_by, expires_at,
        company_name, contact_person, phone, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const adminProvidedData = {
      first_name: invitationData.first_name,
      last_name: invitationData.last_name,
      company_name: invitationData.company_name,
      contact_person: invitationData.contact_person,
      role: invitationData.role,
      ...invitationData.metadata,
    };

    const values = [
      invitationData.email,
      invitationToken,
      invitationData.role,
      adminUserId, // Use verified admin ID
      expiresAt,
      invitationData.company_name,
      invitationData.contact_person,
      invitationData.phone,
      JSON.stringify(adminProvidedData),
    ];

    const result = await client.query(query, values);
    logger.info(`Invitation created by admin for ${invitationData.email}`, {
      invitationId: result.rows[0].id,
      adminId: adminUserId,
      role: invitationData.role,
      company: invitationData.company_name,
    });

    return result.rows[0];
  } catch (error) {
    logger.error('Error creating invitation:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Validate invitation token and return invitation data
 */
export const validateInvitationToken = async (
  token: string
): Promise<Invitation | null> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM user_invitations 
      WHERE invitation_token = $1 AND status = 'pending'
    `;
    const result = await client.query(query, [token]);

    if (result.rows.length === 0) {
      return null;
    }

    const invitation = result.rows[0];

    // Check if invitation has expired
    if (new Date() > new Date(invitation.expires_at)) {
      // Mark as expired
      await markInvitationAsExpired(invitation.id);
      return null;
    }

    return invitation;
  } catch (error) {
    logger.error('Error validating invitation token:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Accept invitation and create user account with admin-provided data
 * Customer only provides password
 */
export const acceptInvitationAndCreateUser = async (
  token: string,
  passwordHash: string
): Promise<{ user: any; invitation: Invitation }> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validate token first
    const invitation = await validateInvitationToken(token);
    if (!invitation) {
      await client.query('ROLLBACK');
      throw new Error('Invalid or expired invitation token');
    }

    // Extract admin-provided data from invitation metadata
    const adminData =
      typeof invitation.metadata === 'string'
        ? JSON.parse(invitation.metadata)
        : invitation.metadata || {};

    // Create user with admin-provided data
    const createUserQuery = `
      INSERT INTO users (
        email, password_hash, role, first_name, last_name,
        invited_by, invitation_accepted_at, is_email_verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), true)
      RETURNING *
    `;

    const userValues = [
      invitation.email,
      passwordHash,
      invitation.role,
      adminData.first_name,
      adminData.last_name,
      invitation.invited_by,
    ];

    const userResult = await client.query(createUserQuery, userValues);
    const user = userResult.rows[0];

    // Create user profile with company data
    const createProfileQuery = `
      INSERT INTO user_profiles (
        user_id, company_name, phone
      )
      VALUES ($1, $2, $3)
    `;

    await client.query(createProfileQuery, [
      user.id,
      invitation.company_name,
      invitation.phone,
    ]);

    // Update invitation status
    const updateInvitationQuery = `
      UPDATE user_invitations 
      SET status = 'accepted', updated_at = NOW()
      WHERE invitation_token = $1
    `;
    await client.query(updateInvitationQuery, [token]);

    await client.query('COMMIT');

    logger.info(
      `Invitation accepted and user created for ${invitation.email}`,
      {
        invitationId: invitation.id,
        userId: user.id,
        role: invitation.role,
        company: invitation.company_name,
      }
    );

    return { user, invitation };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error accepting invitation and creating user:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Accept invitation and mark it as accepted (deprecated - use acceptInvitationAndCreateUser)
 */
export const acceptInvitation = async (
  token: string,
  userId: string
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validate token first
    const invitation = await validateInvitationToken(token);
    if (!invitation) {
      await client.query('ROLLBACK');
      return false;
    }

    // Update invitation status
    const updateInvitationQuery = `
      UPDATE user_invitations 
      SET status = 'accepted', updated_at = NOW()
      WHERE invitation_token = $1
    `;
    await client.query(updateInvitationQuery, [token]);

    // Update user with invitation details
    const updateUserQuery = `
      UPDATE users 
      SET invited_by = $1, invitation_accepted_at = NOW()
      WHERE id = $2
    `;
    await client.query(updateUserQuery, [invitation.invited_by, userId]);

    await client.query('COMMIT');

    logger.info(`Invitation accepted for ${invitation.email}`, {
      invitationId: invitation.id,
      userId: userId,
    });

    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error accepting invitation:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Mark invitation as expired
 */
const markInvitationAsExpired = async (invitationId: string): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE user_invitations 
      SET status = 'expired', updated_at = NOW()
      WHERE id = $1
    `;
    await client.query(query, [invitationId]);

    logger.info(`Invitation marked as expired: ${invitationId}`);
  } catch (error) {
    logger.error('Error marking invitation as expired:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Resend invitation (generate new token and extend expiry)
 */
export const resendInvitation = async (
  invitationId: string
): Promise<Invitation> => {
  const client = await pool.connect();
  try {
    // Generate new token and extend expiry
    const newToken = generateInvitationToken();
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // 7 days from now

    const query = `
      UPDATE user_invitations 
      SET invitation_token = $1, expires_at = $2, status = 'pending', updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await client.query(query, [
      newToken,
      newExpiresAt,
      invitationId,
    ]);

    if (result.rows.length === 0) {
      throw new Error('Invitation not found');
    }

    logger.info(`Invitation resent: ${invitationId}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error resending invitation:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Cancel invitation
 */
export const cancelInvitation = async (
  invitationId: string
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE user_invitations 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND status IN ('pending', 'expired')
    `;

    const result = await client.query(query, [invitationId]);

    if ((result.rowCount ?? 0) > 0) {
      logger.info(`Invitation cancelled: ${invitationId}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error cancelling invitation:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get invitations by status
 */
export const getInvitationsByStatus = async (
  status?: 'pending' | 'accepted' | 'expired' | 'cancelled'
): Promise<Invitation[]> => {
  const client = await pool.connect();
  try {
    let query = `
      SELECT ui.*, u.first_name as inviter_first_name, u.last_name as inviter_last_name
      FROM user_invitations ui
      LEFT JOIN users u ON ui.invited_by = u.id
    `;

    const values: any[] = [];
    if (status) {
      query += ' WHERE ui.status = $1';
      values.push(status);
    }

    query += ' ORDER BY ui.created_at DESC';

    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    logger.error('Error getting invitations by status:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get invitation by ID
 */
export const getInvitationById = async (
  invitationId: string
): Promise<Invitation | null> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT ui.*, u.first_name as inviter_first_name, u.last_name as inviter_last_name
      FROM user_invitations ui
      LEFT JOIN users u ON ui.invited_by = u.id
      WHERE ui.id = $1
    `;

    const result = await client.query(query, [invitationId]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error getting invitation by ID:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Clean up expired invitations (run periodically)
 */
export const cleanupExpiredInvitations = async (): Promise<number> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE user_invitations 
      SET status = 'expired', updated_at = NOW()
      WHERE status = 'pending' AND expires_at < NOW()
    `;

    const result = await client.query(query);
    const cleanedCount = result.rowCount ?? 0;

    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} expired invitations`);
    }

    return cleanedCount;
  } catch (error) {
    logger.error('Error cleaning up expired invitations:', error);
    throw error;
  } finally {
    client.release();
  }
};
