-- Database schema for admin system
-- Execute these SQL commands to add the required tables

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, setting_key)
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'completed', 'error')),
    frequency VARCHAR(20) DEFAULT 'once' CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly')),
    last_run TIMESTAMP,
    next_run TIMESTAMP,
    recipients TEXT, -- JSON array of email addresses
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parameters TEXT -- JSON object with report parameters
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    api_key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions TEXT, -- JSON array of permissions
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    expires_at TIMESTAMP
);

-- Backup Log Table
CREATE TABLE IF NOT EXISTS backup_log (
    id SERIAL PRIMARY KEY,
    backup_id VARCHAR(100) NOT NULL UNIQUE,
    backup_type VARCHAR(20) DEFAULT 'manual' CHECK (backup_type IN ('manual', 'scheduled')),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    file_path VARCHAR(500),
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Add company column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'company') THEN
        ALTER TABLE users ADD COLUMN company VARCHAR(255);
    END IF;
END $$;

-- Add phone column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(50);
    END IF;
END $$;

-- Add address column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'address') THEN
        ALTER TABLE users ADD COLUMN address TEXT;
    END IF;
END $$;

-- Add status column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended'));
    END IF;
END $$;

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    order_items TEXT, -- JSON array of order items
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
('general', 'siteName', '"AutoCare Advisor"', 'Website name'),
('general', 'siteDescription', '"Professional B2B Autopflegemittel Platform"', 'Website description'),
('general', 'siteUrl', '"https://autocare-advisor.com"', 'Main website URL'),
('general', 'adminEmail', '"admin@autocare-advisor.com"', 'Main admin email'),
('general', 'timezone', '"Europe/Berlin"', 'Default timezone'),
('general', 'language', '"de"', 'Default language'),
('general', 'maintenanceMode', 'false', 'Maintenance mode status'),

('security', 'twoFactorRequired', 'true', 'Require 2FA for admin users'),
('security', 'passwordMinLength', '8', 'Minimum password length'),
('security', 'sessionTimeout', '1440', 'Session timeout in minutes'),
('security', 'maxLoginAttempts', '5', 'Maximum login attempts before lockout'),
('security', 'allowedIpAddresses', '["192.168.1.0/24", "10.0.0.0/8"]', 'Allowed IP ranges'),
('security', 'sslEnabled', 'true', 'SSL enforcement status'),

('notifications', 'emailEnabled', 'true', 'Enable email notifications'),
('notifications', 'smsEnabled', 'false', 'Enable SMS notifications'),
('notifications', 'pushEnabled', 'true', 'Enable push notifications'),
('notifications', 'adminNotifications', '{"newUsers": true, "newOrders": true, "systemErrors": true, "securityAlerts": true}', 'Admin notification preferences'),
('notifications', 'userNotifications', '{"orderUpdates": true, "newsletters": true, "promotions": false}', 'Default user notification preferences'),

('api', 'rateLimit', '1000', 'API rate limit per hour'),
('api', 'allowedOrigins', '["https://app.autocare-advisor.com", "https://partner.autocare-advisor.com"]', 'Allowed CORS origins'),
('api', 'webhookUrl', '"https://api.autocare-advisor.com/webhooks"', 'Webhook endpoint URL'),

('database', 'autoBackup', 'true', 'Enable automatic backups'),
('database', 'backupRetention', '30', 'Backup retention in days')

ON CONFLICT (category, setting_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_next_run ON reports(next_run) WHERE next_run IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, is_active);
CREATE INDEX IF NOT EXISTS idx_backup_log_status ON backup_log(status);

-- Create a sample admin user (update password properly in real implementation)
INSERT INTO users (first_name, last_name, email, password_hash, role, is_active, created_at) VALUES
('Super', 'Admin', 'admin@autocare.com', '$2b$10$example_hash_here', 'super_admin', true, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE system_settings IS 'System configuration settings';
COMMENT ON TABLE reports IS 'Generated and scheduled reports';
COMMENT ON TABLE api_keys IS 'API access keys for external integrations';
COMMENT ON TABLE backup_log IS 'Database backup history and status';