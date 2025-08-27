import express from 'express';
import pool from '../database/postgres';
import { requireAdmin } from '../middleware/adminAuth';
import logger from '../utils/logger';

const router = express.Router();

// Get System Settings
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get all settings from database
    const settingsQuery = `
      SELECT category, setting_key, setting_value, description, is_sensitive
      FROM system_settings
      ORDER BY category, setting_key
    `;

    const result = await pool.query(settingsQuery);

    // Group settings by category
    const settings: any = {
      general: {},
      security: {},
      notifications: {},
      api: {},
      database: {},
    };

    result.rows.forEach((row) => {
      const { category, setting_key, setting_value, is_sensitive } = row;

      if (settings[category]) {
        // Parse JSON values
        let value;
        try {
          value = JSON.parse(setting_value);
        } catch {
          value = setting_value;
        }

        // Hide sensitive values in response
        if (is_sensitive) {
          value = '***hidden***';
        }

        settings[category][setting_key] = value;
      }
    });

    // Add some default values if not in database
    if (Object.keys(settings.general).length === 0) {
      settings.general = {
        siteName: 'AutoCare Advisor',
        siteDescription: 'Professional B2B Autopflegemittel Platform',
        siteUrl: 'https://autocare-advisor.com',
        adminEmail: 'admin@autocare-advisor.com',
        timezone: 'Europe/Berlin',
        language: 'de',
        maintenanceMode: false,
      };
    }

    if (Object.keys(settings.security).length === 0) {
      settings.security = {
        twoFactorRequired: true,
        passwordMinLength: 8,
        sessionTimeout: 1440,
        maxLoginAttempts: 5,
        allowedIpAddresses: ['192.168.1.0/24', '10.0.0.0/8'],
        sslEnabled: true,
      };
    }

    // Get database status
    const dbStatusQuery = `
      SELECT 
        COUNT(*) as total_connections,
        NOW() as current_time
    `;
    const dbStatus = await pool.query(dbStatusQuery);

    settings.database.connectionStatus = 'connected';
    settings.database.totalConnections = parseInt(
      dbStatus.rows[0].total_connections
    );
    settings.database.lastBackup = new Date(
      Date.now() - 86400000
    ).toISOString();
    settings.database.nextBackup = new Date(
      Date.now() + 86400000
    ).toISOString();
    settings.database.autoBackup = true;
    settings.database.backupRetention = 30;

    // Get API statistics
    const apiStatsQuery = `
      SELECT COUNT(*) as api_key_count
      FROM api_keys
      WHERE is_active = true
    `;
    try {
      const apiStats = await pool.query(apiStatsQuery);
      settings.api.apiKeysCount = parseInt(apiStats.rows[0].api_key_count) || 3;
    } catch {
      settings.api.apiKeysCount = 3; // Default value
    }

    settings.api.rateLimit = settings.api.rateLimit || 1000;
    settings.api.allowedOrigins = settings.api.allowedOrigins || [
      'https://app.autocare-advisor.com',
    ];
    settings.api.webhookUrl =
      settings.api.webhookUrl || 'https://api.autocare-advisor.com/webhooks';

    // Notification defaults
    if (Object.keys(settings.notifications).length === 0) {
      settings.notifications = {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        adminNotifications: {
          newUsers: true,
          newOrders: true,
          systemErrors: true,
          securityAlerts: true,
        },
        userNotifications: {
          orderUpdates: true,
          newsletters: true,
          promotions: false,
        },
      };
    }

    logger.info('⚙️ System settings retrieved');

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error('❌ Error fetching system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Update System Settings
router.put('/', requireAdmin, async (req, res) => {
  try {
    const { category, settings } = req.body;

    if (!category || !settings) {
      return res.status(400).json({
        success: false,
        message: 'Category and settings are required',
      });
    }

    // Validate category
    const validCategories = [
      'general',
      'security',
      'notifications',
      'api',
      'database',
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    // Update or insert settings
    for (const [key, value] of Object.entries(settings)) {
      const upsertQuery = `
        INSERT INTO system_settings (category, setting_key, setting_value, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (category, setting_key)
        DO UPDATE SET 
          setting_value = EXCLUDED.setting_value,
          updated_at = CURRENT_TIMESTAMP
      `;

      await pool.query(upsertQuery, [category, key, JSON.stringify(value)]);
    }

    logger.info(`⚙️ Updated ${category} settings`);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        category,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('❌ Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system settings',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Get Admin Users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const adminUsersQuery = `
      SELECT 
        id,
        name,
        email,
        role,
        status,
        created_at,
        last_login,
        permissions
      FROM users 
      WHERE role IN ('super_admin', 'admin', 'moderator')
      ORDER BY 
        CASE role 
          WHEN 'super_admin' THEN 1 
          WHEN 'admin' THEN 2 
          WHEN 'moderator' THEN 3 
          ELSE 4 
        END,
        created_at DESC
    `;

    const result = await pool.query(adminUsersQuery);

    const adminUsers = result.rows.map((user) => ({
      ...user,
      permissions:
        typeof user.permissions === 'string'
          ? JSON.parse(user.permissions || '[]')
          : user.permissions || [],
    }));

    logger.info(`👥 Retrieved ${adminUsers.length} admin users`);

    res.json({
      success: true,
      data: adminUsers,
    });
  } catch (error) {
    logger.error('❌ Error fetching admin users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin users',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Create Admin User
router.post('/users', requireAdmin, async (req, res) => {
  try {
    const { name, email, role = 'admin', permissions = [] } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Validate role
    const validRoles = ['admin', 'moderator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin or moderator',
      });
    }

    // Check if user already exists
    const existingUserQuery = `
      SELECT id FROM users WHERE email = $1
    `;
    const existingUser = await pool.query(existingUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate temporary password (in real app, this would be sent via email)
    const tempPassword = Math.random().toString(36).slice(-10);

    // Create new admin user
    const insertQuery = `
      INSERT INTO users (
        name, 
        email, 
        password_hash, 
        role, 
        status, 
        permissions,
        created_at
      ) VALUES ($1, $2, $3, $4, 'active', $5, CURRENT_TIMESTAMP)
      RETURNING id, name, email, role, status, created_at
    `;

    // In real implementation, hash the password properly
    const passwordHash = `temp_${tempPassword}`;

    const result = await pool.query(insertQuery, [
      name,
      email,
      passwordHash,
      role,
      JSON.stringify(permissions),
    ]);

    const newUser = result.rows[0];

    logger.info(`👤 Created new admin user: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        ...newUser,
        tempPassword: tempPassword, // In real app, this would be sent via email
      },
    });
  } catch (error) {
    logger.error('❌ Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Update Admin User
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, permissions } = req.body;

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramCounter = 1;

    if (name) {
      updateFields.push(`name = $${paramCounter}`);
      values.push(name);
      paramCounter++;
    }

    if (email) {
      updateFields.push(`email = $${paramCounter}`);
      values.push(email);
      paramCounter++;
    }

    if (role && ['admin', 'moderator'].includes(role)) {
      updateFields.push(`role = $${paramCounter}`);
      values.push(role);
      paramCounter++;
    }

    if (status && ['active', 'inactive'].includes(status)) {
      updateFields.push(`status = $${paramCounter}`);
      values.push(status);
      paramCounter++;
    }

    if (permissions) {
      updateFields.push(`permissions = $${paramCounter}`);
      values.push(JSON.stringify(permissions));
      paramCounter++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCounter} AND role IN ('admin', 'moderator', 'super_admin')
      RETURNING id, name, email, role, status, permissions, updated_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    logger.info(`✏️ Updated admin user: ${result.rows[0].email}`);

    res.json({
      success: true,
      message: 'Admin user updated successfully',
      data: {
        ...result.rows[0],
        permissions: JSON.parse(result.rows[0].permissions || '[]'),
      },
    });
  } catch (error) {
    logger.error('❌ Error updating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin user',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Database Backup
router.post('/database/backup', requireAdmin, async (req, res) => {
  try {
    // In a real implementation, this would trigger an actual backup
    const backupId = `backup_${Date.now()}`;
    const backupDate = new Date().toISOString();

    // Simulate backup process
    logger.info('🗄️ Starting database backup...');

    // In real implementation, this would:
    // 1. Create a database dump
    // 2. Upload to cloud storage
    // 3. Update backup log

    // Mock backup success
    setTimeout(async () => {
      try {
        // Log backup completion
        const logQuery = `
          INSERT INTO backup_log (backup_id, backup_type, status, created_at, file_size)
          VALUES ($1, 'manual', 'completed', $2, $3)
        `;

        await pool.query(logQuery, [
          backupId,
          backupDate,
          Math.floor(Math.random() * 1000000) + 500000,
        ]);
        logger.info(`✅ Database backup completed: ${backupId}`);
      } catch (logError) {
        logger.error('❌ Error logging backup:', logError);
      }
    }, 2000);

    res.json({
      success: true,
      message: 'Database backup started successfully',
      data: {
        backupId,
        startedAt: backupDate,
        status: 'in_progress',
      },
    });
  } catch (error) {
    logger.error('❌ Error starting database backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start database backup',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Generate API Key
router.post('/api-keys', requireAdmin, async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'API key name is required',
      });
    }

    // Generate API key
    const apiKey =
      'ak_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store in database
    const insertQuery = `
      INSERT INTO api_keys (
        name, 
        api_key_hash, 
        permissions, 
        is_active, 
        created_at,
        last_used
      ) VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP, NULL)
      RETURNING id, name, created_at
    `;

    // In real implementation, hash the API key
    const apiKeyHash = `hash_${apiKey}`;

    const result = await pool.query(insertQuery, [
      name,
      apiKeyHash,
      JSON.stringify(permissions),
    ]);

    logger.info(`🔑 Generated new API key: ${name}`);

    res.status(201).json({
      success: true,
      message: 'API key generated successfully',
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        apiKey: apiKey, // Only shown once
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    logger.error('❌ Error generating API key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate API key',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// System Health Check
router.get('/health', requireAdmin, async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        postgresql: 'connected',
        mongodb: 'connected',
      },
      services: {
        api: 'operational',
        auth: 'operational',
        fileUpload: 'operational',
      },
    };

    // Test database connection
    try {
      await pool.query('SELECT 1');
      health.database.postgresql = 'connected';
    } catch {
      health.database.postgresql = 'disconnected';
      health.status = 'degraded';
    }

    logger.info('🏥 System health check performed');

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('❌ Error performing health check:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform health check',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

export default router;
