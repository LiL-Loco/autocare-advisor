-- AutoCare Advisor Product Management Schema Extension
-- Additional PostgreSQL tables for Product Management Features

-- Product Import Jobs (for CSV Import tracking)
CREATE TABLE IF NOT EXISTS product_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- Status: pending, processing, completed, failed, cancelled
    
    -- Processing Details
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    successful_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    
    -- Results
    created_products JSONB DEFAULT '[]',
    error_details JSONB DEFAULT '[]',
    processing_log TEXT,
    
    -- Metadata
    import_settings JSONB DEFAULT '{}',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for product_import_jobs
CREATE INDEX IF NOT EXISTS idx_product_import_jobs_partner_id ON product_import_jobs(partner_id);
CREATE INDEX IF NOT EXISTS idx_product_import_jobs_status ON product_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_product_import_jobs_created_at ON product_import_jobs(created_at);

-- Product Categories Management
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
    
    -- Category Properties
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for product_categories
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_is_active ON product_categories(is_active);

-- Product Brands Management
CREATE TABLE IF NOT EXISTS product_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    
    -- Brand Properties
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for product_brands
CREATE INDEX IF NOT EXISTS idx_product_brands_slug ON product_brands(slug);
CREATE INDEX IF NOT EXISTS idx_product_brands_is_active ON product_brands(is_active);
CREATE INDEX IF NOT EXISTS idx_product_brands_is_featured ON product_brands(is_featured);

-- Product Analytics (PostgreSQL for relational queries, MongoDB for product data)
CREATE TABLE IF NOT EXISTS product_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(50) NOT NULL, -- MongoDB ObjectId as string
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Daily Metrics
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    
    -- Engagement Metrics
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Revenue Metrics (in cents to avoid floating point issues)
    revenue_cents INTEGER DEFAULT 0,
    commission_cents INTEGER DEFAULT 0,
    
    -- Source Analytics
    traffic_sources JSONB DEFAULT '{}',
    referrer_data JSONB DEFAULT '{}',
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate daily entries
    UNIQUE(product_id, partner_id, date)
);

-- Create indexes for product_analytics
CREATE INDEX IF NOT EXISTS idx_product_analytics_product_id ON product_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_partner_id ON product_analytics(partner_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date);
CREATE INDEX IF NOT EXISTS idx_product_analytics_partner_date ON product_analytics(partner_id, date);

-- Product Performance Summary (Materialized View for faster queries)
CREATE TABLE IF NOT EXISTS product_performance_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(50) NOT NULL UNIQUE, -- MongoDB ObjectId as string
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Aggregate Metrics (Last 30 days)
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    avg_conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Revenue Metrics (Last 30 days, in cents)
    total_revenue_cents INTEGER DEFAULT 0,
    total_commission_cents INTEGER DEFAULT 0,
    avg_revenue_per_click_cents INTEGER DEFAULT 0,
    
    -- Performance Indicators
    performance_score INTEGER DEFAULT 0, -- 0-100 score
    ranking_position INTEGER DEFAULT 0,
    trend_direction VARCHAR(10) DEFAULT 'stable', -- up, down, stable
    
    -- Last Updated
    last_calculated_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for product_performance_summary
CREATE INDEX IF NOT EXISTS idx_product_performance_summary_product_id ON product_performance_summary(product_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_summary_partner_id ON product_performance_summary(partner_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_summary_performance_score ON product_performance_summary(performance_score DESC);

-- CSV Import Template Configurations
CREATE TABLE IF NOT EXISTS csv_import_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Template Configuration
    field_mappings JSONB NOT NULL,
    -- Example: {"name": "A", "price": "B", "brand": "C"}
    
    validation_rules JSONB DEFAULT '{}',
    default_values JSONB DEFAULT '{}',
    
    -- Template Properties
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Usage Stats
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for csv_import_templates
CREATE INDEX IF NOT EXISTS idx_csv_import_templates_is_default ON csv_import_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_csv_import_templates_is_active ON csv_import_templates(is_active);

-- Product Moderation Queue (for Admin Dashboard)
CREATE TABLE IF NOT EXISTS product_moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(50) NOT NULL, -- MongoDB ObjectId as string
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Moderation Details
    action_type VARCHAR(50) NOT NULL, -- create, update, delete, bulk_import
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Content to be moderated
    product_data JSONB NOT NULL,
    changes_summary TEXT,
    
    -- Moderation Results
    moderator_id UUID REFERENCES users(id),
    moderated_at TIMESTAMP,
    moderation_notes TEXT,
    rejection_reason TEXT,
    
    -- Flags & Metadata
    flags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for product_moderation_queue
CREATE INDEX IF NOT EXISTS idx_product_moderation_queue_status ON product_moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_product_moderation_queue_partner_id ON product_moderation_queue(partner_id);
CREATE INDEX IF NOT EXISTS idx_product_moderation_queue_priority ON product_moderation_queue(priority);
CREATE INDEX IF NOT EXISTS idx_product_moderation_queue_created_at ON product_moderation_queue(created_at);

-- Insert default categories
INSERT INTO product_categories (name, slug, description, is_active, sort_order, icon, color) VALUES
('Lackreinigung', 'lackreinigung', 'Produkte für die professionelle Lackreinigung', true, 1, '🚿', '#3B82F6'),
('Innenraumreinigung', 'innenraumreinigung', 'Reinigungsprodukte für den Fahrzeuginnenraum', true, 2, '🪑', '#10B981'),
('Felgenpflege', 'felgenpflege', 'Spezialisierte Felgenreiniger und Pflegeprodukte', true, 3, '⚙️', '#F59E0B'),
('Polituren & Wachse', 'polituren-wachse', 'Hochwertige Polituren und Wachse für perfekten Glanz', true, 4, '✨', '#8B5CF6'),
('Schutzprodukte', 'schutzprodukte', 'Langzeitschutz für alle Fahrzeugoberflächen', true, 5, '🛡️', '#EF4444'),
('Werkzeuge & Zubehör', 'werkzeuge-zubehoer', 'Professionelles Werkzeug und Zubehör', true, 6, '🔧', '#6B7280'),
('Detailing-Tools', 'detailing-tools', 'Spezialisierte Tools für Auto-Detailing', true, 7, '🎯', '#EC4899'),
('Pflegesets', 'pflegesets', 'Komplette Pflegesets für verschiedene Anwendungen', true, 8, '📦', '#14B8A6')
ON CONFLICT (name) DO NOTHING;

-- Insert default CSV import template
INSERT INTO csv_import_templates (name, description, field_mappings, default_values, is_default) VALUES
('Standard AutoCare CSV', 'Standard template for automotive care products', 
'{"name": "A", "description": "B", "brand": "C", "category": "D", "price": "E", "images": "F", "features": "G"}',
'{"tier": "basic", "isActive": true, "inStock": true, "rating": 4.0}',
true
) ON CONFLICT DO NOTHING;

-- Create triggers for updated_at columns
CREATE TRIGGER update_product_import_jobs_updated_at 
    BEFORE UPDATE ON product_import_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at 
    BEFORE UPDATE ON product_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_brands_updated_at 
    BEFORE UPDATE ON product_brands 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_analytics_updated_at 
    BEFORE UPDATE ON product_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_performance_summary_updated_at 
    BEFORE UPDATE ON product_performance_summary 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_csv_import_templates_updated_at 
    BEFORE UPDATE ON csv_import_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_moderation_queue_updated_at 
    BEFORE UPDATE ON product_moderation_queue 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();