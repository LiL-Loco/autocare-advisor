import { Pool } from 'pg';
import logger from '../utils/logger';

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:locoapp@localhost:5432/autocare_dev',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool
  .connect()
  .then(() => logger.info('✅ PostgreSQL connected successfully'))
  .catch((err) => logger.error('❌ PostgreSQL connection failed:', err));

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'partner' | 'customer';
  tenant_id?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  role?: 'admin' | 'partner' | 'customer';
  tenant_id?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  refresh_token: string;
  device_info?: object;
  ip_address?: string;
  expires_at: Date;
  is_active: boolean;
  created_at: Date;
}

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO users (email, password_hash, role, tenant_id, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      userData.email,
      userData.password_hash,
      userData.role || 'customer',
      userData.tenant_id,
      userData.first_name,
      userData.last_name,
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await client.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding user by email:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Find user by ID
 */
export const findUserById = async (id: string): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding user by ID:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update user's last login timestamp
 */
export const updateLastLogin = async (userId: string): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = $1';
    await client.query(query, [userId]);
  } catch (error) {
    logger.error('Error updating last login:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Create user session for refresh token
 */
export const createUserSession = async (
  userId: string,
  refreshToken: string,
  deviceInfo?: object,
  ipAddress?: string
): Promise<UserSession> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO user_sessions (user_id, refresh_token, metadata, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
      RETURNING *
    `;
    const values = [
      userId,
      refreshToken,
      JSON.stringify(deviceInfo || {}),
      ipAddress,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating user session:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Find valid user session by refresh token
 */
export const findValidSession = async (
  refreshToken: string
): Promise<UserSession | null> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM user_sessions 
      WHERE refresh_token = $1 
        AND is_active = true 
        AND expires_at > NOW()
    `;
    const result = await client.query(query, [refreshToken]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding valid session:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Invalidate user session
 */
export const invalidateSession = async (
  refreshToken: string
): Promise<void> => {
  const client = await pool.connect();
  try {
    const query =
      'UPDATE user_sessions SET is_active = false WHERE refresh_token = $1';
    await client.query(query, [refreshToken]);
  } catch (error) {
    logger.error('Error invalidating session:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Invalidate all user sessions (logout from all devices)
 */
export const invalidateAllUserSessions = async (
  userId: string
): Promise<void> => {
  const client = await pool.connect();
  try {
    const query =
      'UPDATE user_sessions SET is_active = false WHERE user_id = $1';
    await client.query(query, [userId]);
  } catch (error) {
    logger.error('Error invalidating all user sessions:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update password reset token
 */
export const updatePasswordResetToken = async (
  email: string,
  token: string,
  expiresIn: Date
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE users 
      SET password_reset_token = $1, password_reset_expires = $2 
      WHERE email = $3 AND is_active = true
    `;
    const result = await client.query(query, [token, expiresIn, email]);
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    logger.error('Error updating password reset token:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (
  userId: string,
  passwordHash: string
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE users 
      SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL
      WHERE id = $2
    `;
    const result = await client.query(query, [passwordHash, userId]);
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    logger.error('Error updating user password:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
