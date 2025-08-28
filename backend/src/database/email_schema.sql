-- E-Mail Marketing & Communication System Database Schema
-- AutoCare Advisor - CL-35 Implementation

-- ============================================================================
-- EMAIL TEMPLATES
-- ============================================================================
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(200) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    template_type VARCHAR(50) NOT NULL DEFAULT 'marketing',
    -- Types: 'onboarding', 'marketing', 'transactional', 'nurturing', 'notification'
    template_category VARCHAR(50),
    -- Categories: 'welcome', 'demo', 'trial', 'upgrade', 'report', 'alert'
    variables JSONB DEFAULT '[]',
    -- Dynamic template variables like ["firstName", "companyName", "dashboardLink"]
    preview_text VARCHAR(150),
    -- Email preview text for better open rates
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_email_templates_type ON email_templates(template_type);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

-- ============================================================================
-- EMAIL CAMPAIGNS
-- ============================================================================
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES email_templates(id),
    
    -- Targeting & Segmentation
    target_segments JSONB DEFAULT '{}',
    -- Example: {"tier": ["professional", "enterprise"], "status": ["active"], "signup_date": {"after": "2025-01-01"}}
    
    -- Scheduling & Automation
    schedule_type VARCHAR(20) NOT NULL DEFAULT 'immediate',
    -- Types: 'immediate', 'scheduled', 'triggered', 'recurring'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    trigger_event VARCHAR(50),
    -- Events: 'signup', 'first_product', 'trial_end', 'low_usage', 'high_performance'
    trigger_delay_hours INTEGER DEFAULT 0,
    -- Delay before sending triggered email
    
    -- Recurring campaigns
    recurring_type VARCHAR(20),
    -- Types: 'daily', 'weekly', 'monthly', 'quarterly'
    recurring_day INTEGER,
    -- Day of week (1-7) or day of month (1-31)
    
    -- Campaign Status & Control
    status VARCHAR(20) DEFAULT 'draft',
    -- Status: 'draft', 'active', 'paused', 'completed', 'archived'
    
    -- A/B Testing
    ab_test_enabled BOOLEAN DEFAULT false,
    ab_test_subject_b VARCHAR(200),
    ab_test_split_percentage INTEGER DEFAULT 50,
    -- Percentage for variant A (rest goes to B)
    
    -- Campaign Limits & Controls
    max_sends_per_day INTEGER,
    max_sends_total INTEGER,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_campaigns_trigger ON email_campaigns(trigger_event);
CREATE INDEX idx_campaigns_scheduled ON email_campaigns(scheduled_at);

-- ============================================================================
-- EMAIL SEQUENCES (Multi-step email flows)
-- ============================================================================
CREATE TABLE email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(50) NOT NULL,
    -- Events: 'partner_signup', 'trial_start', 'product_upload', etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE email_sequence_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    template_id UUID REFERENCES email_templates(id),
    delay_hours INTEGER DEFAULT 0,
    -- Hours to wait before sending this step
    conditions JSONB DEFAULT '{}',
    -- Conditions to check before sending (user actions, properties, etc.)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(sequence_id, step_order)
);

-- ============================================================================
-- EMAIL LOGS & TRACKING
-- ============================================================================
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Campaign & Template Info
    campaign_id UUID REFERENCES email_campaigns(id),
    sequence_id UUID REFERENCES email_sequences(id),
    sequence_step_id UUID REFERENCES email_sequence_steps(id),
    template_id UUID REFERENCES email_templates(id),
    
    -- Recipient Info
    recipient_email VARCHAR(255) NOT NULL,
    recipient_id UUID REFERENCES users(id),
    recipient_name VARCHAR(100),
    
    -- Email Content (for tracking purposes)
    subject VARCHAR(200),
    template_variables JSONB,
    
    -- A/B Testing
    ab_test_variant VARCHAR(1),
    -- 'A' or 'B' for A/B testing
    
    -- Delivery Status
    status VARCHAR(20) DEFAULT 'queued',
    -- Status: 'queued', 'sent', 'delivered', 'bounced', 'failed'
    external_id VARCHAR(100),
    -- ID from email service provider (SendGrid, etc.)
    
    -- Engagement Tracking
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    first_clicked_at TIMESTAMP WITH TIME ZONE,
    last_clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    complained_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    
    -- Click Tracking Details
    click_count INTEGER DEFAULT 0,
    unique_click_count INTEGER DEFAULT 0,
    clicked_links JSONB DEFAULT '[]',
    -- Array of clicked URLs for detailed tracking
    
    -- Error Info
    bounce_reason TEXT,
    error_message TEXT,
    
    -- Metadata
    sent_from_ip INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics performance
CREATE INDEX idx_email_logs_campaign ON email_logs(campaign_id);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_email_logs_opened_at ON email_logs(opened_at);

-- ============================================================================
-- UNSUBSCRIBE MANAGEMENT (GDPR Compliance)
-- ============================================================================
CREATE TABLE email_unsubscribes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    
    -- Granular unsubscribe options
    unsubscribe_type VARCHAR(20) DEFAULT 'all',
    -- Types: 'all', 'marketing', 'transactional', 'notifications'
    campaign_types TEXT[] DEFAULT ARRAY['marketing'],
    -- Array of campaign types to unsubscribe from
    
    -- Unsubscribe source
    source VARCHAR(50),
    -- Source: 'email_link', 'admin_panel', 'user_request', 'bounce'
    campaign_id UUID REFERENCES email_campaigns(id),
    -- Campaign that triggered unsubscribe
    
    -- Metadata
    unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT,
    -- Optional reason for unsubscribing
    ip_address INET,
    user_agent TEXT,
    
    UNIQUE(email, unsubscribe_type)
);

CREATE INDEX idx_unsubscribes_email ON email_unsubscribes(email);
CREATE INDEX idx_unsubscribes_type ON email_unsubscribes(unsubscribe_type);

-- ============================================================================
-- EMAIL PREFERENCES (Per-user email settings)
-- ============================================================================
CREATE TABLE email_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    email VARCHAR(255) NOT NULL,
    
    -- Preference Settings
    marketing_enabled BOOLEAN DEFAULT true,
    transactional_enabled BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    weekly_reports_enabled BOOLEAN DEFAULT true,
    monthly_reports_enabled BOOLEAN DEFAULT true,
    
    -- Frequency Preferences
    max_marketing_per_week INTEGER DEFAULT 3,
    preferred_send_time TIME DEFAULT '10:00',
    preferred_timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
    
    -- Communication Preferences
    preferred_language VARCHAR(5) DEFAULT 'de',
    html_enabled BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- EMAIL ANALYTICS AGGREGATES (For faster reporting)
-- ============================================================================
CREATE TABLE email_analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    campaign_id UUID REFERENCES email_campaigns(id),
    template_id UUID REFERENCES email_templates(id),
    
    -- Send Metrics
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    emails_failed INTEGER DEFAULT 0,
    
    -- Engagement Metrics
    emails_opened INTEGER DEFAULT 0,
    unique_opens INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    
    -- Negative Metrics
    emails_complained INTEGER DEFAULT 0,
    emails_unsubscribed INTEGER DEFAULT 0,
    
    -- Calculated Rates (stored for performance)
    delivery_rate DECIMAL(5,2),
    open_rate DECIMAL(5,2),
    click_rate DECIMAL(5,2),
    click_to_open_rate DECIMAL(5,2),
    unsubscribe_rate DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(date, campaign_id, template_id)
);

CREATE INDEX idx_analytics_date ON email_analytics_daily(date);
CREATE INDEX idx_analytics_campaign ON email_analytics_daily(campaign_id);

-- ============================================================================
-- EMAIL QUEUE (For batch processing)
-- ============================================================================
CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Email Details
    recipient_email VARCHAR(255) NOT NULL,
    recipient_id UUID REFERENCES users(id),
    template_id UUID REFERENCES email_templates(id),
    campaign_id UUID REFERENCES email_campaigns(id),
    
    -- Email Content
    subject VARCHAR(200),
    html_content TEXT,
    text_content TEXT,
    template_variables JSONB,
    
    -- Queue Management
    priority INTEGER DEFAULT 5,
    -- 1 = highest priority, 10 = lowest
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    -- Status
    status VARCHAR(20) DEFAULT 'queued',
    -- Status: 'queued', 'processing', 'sent', 'failed', 'cancelled'
    
    -- Error Handling
    last_error TEXT,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for queue processing
CREATE INDEX idx_queue_status ON email_queue(status);
CREATE INDEX idx_queue_scheduled ON email_queue(scheduled_for);
CREATE INDEX idx_queue_priority ON email_queue(priority);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
    BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_preferences_updated_at
    BEFORE UPDATE ON email_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Basic templates and sequences)
-- ============================================================================

-- Insert basic email templates
INSERT INTO email_templates (name, subject, html_content, text_content, template_type, template_category, variables) VALUES
(
    'welcome_partner',
    'Willkommen bei AutoCare Advisor, {{firstName}}!',
    '<h1>Willkommen bei AutoCare Advisor!</h1><p>Hallo {{firstName}},</p><p>herzlich willkommen bei AutoCare Advisor! Wir freuen uns, {{companyName}} in unserem Partner-Netzwerk zu begrüßen.</p><p><a href="{{dashboardUrl}}">Zum Partner Dashboard</a></p>',
    'Willkommen bei AutoCare Advisor!\n\nHallo {{firstName}},\n\nherzlich willkommen bei AutoCare Advisor! Wir freuen uns, {{companyName}} in unserem Partner-Netzwerk zu begrüßen.\n\nZum Partner Dashboard: {{dashboardUrl}}',
    'onboarding',
    'welcome',
    '["firstName", "companyName", "dashboardUrl"]'
),
(
    'password_reset',
    'Passwort zurücksetzen - AutoCare Advisor',
    '<h2>Passwort zurücksetzen</h2><p>Hallo {{firstName}},</p><p>Sie haben eine Passwort-Zurücksetzung für Ihr AutoCare Advisor Konto angefordert.</p><p><a href="{{resetUrl}}">Passwort jetzt zurücksetzen</a></p><p>Dieser Link ist 24 Stunden gültig.</p>',
    'Passwort zurücksetzen\n\nHallo {{firstName}},\n\nSie haben eine Passwort-Zurücksetzung für Ihr AutoCare Advisor Konto angefordert.\n\nPasswort zurücksetzen: {{resetUrl}}\n\nDieser Link ist 24 Stunden gültig.',
    'transactional',
    'account',
    '["firstName", "resetUrl"]'
),
(
    'monthly_report',
    'Ihr monatlicher Performance Report - {{month}}',
    '<h1>Performance Report für {{month}}</h1><p>Hallo {{firstName}},</p><p>hier ist Ihr monatlicher Performance Report:</p><ul><li>Produktaufrufe: {{totalViews}}</li><li>Klicks: {{totalClicks}}</li><li>Umsatz: €{{revenue}}</li></ul>',
    'Performance Report für {{month}}\n\nHallo {{firstName}},\n\nhier ist Ihr monatlicher Performance Report:\n- Produktaufrufe: {{totalViews}}\n- Klicks: {{totalClicks}}\n- Umsatz: €{{revenue}}',
    'notification',
    'report',
    '["firstName", "month", "totalViews", "totalClicks", "revenue"]'
);

-- Insert welcome sequence
INSERT INTO email_sequences (name, description, trigger_event) VALUES
(
    'Partner Onboarding',
    '7-step onboarding sequence for new partners',
    'partner_signup'
);

-- Get sequence ID for steps
WITH seq AS (SELECT id FROM email_sequences WHERE name = 'Partner Onboarding' LIMIT 1)
INSERT INTO email_sequence_steps (sequence_id, step_order, template_id, delay_hours)
SELECT seq.id, 1, et.id, 0
FROM seq, email_templates et
WHERE et.name = 'welcome_partner';

COMMENT ON TABLE email_templates IS 'Stores reusable email templates with dynamic variables';
COMMENT ON TABLE email_campaigns IS 'Manages email campaigns with targeting and scheduling';
COMMENT ON TABLE email_sequences IS 'Multi-step automated email sequences';
COMMENT ON TABLE email_logs IS 'Tracks all sent emails with engagement metrics';
COMMENT ON TABLE email_unsubscribes IS 'GDPR-compliant unsubscribe management';
COMMENT ON TABLE email_preferences IS 'Per-user email preferences and settings';
COMMENT ON TABLE email_analytics_daily IS 'Daily aggregated email analytics for reporting';
COMMENT ON TABLE email_queue IS 'Email queue for batch processing and delivery';