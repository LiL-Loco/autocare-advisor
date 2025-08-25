CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    invitation_token VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'partner',
    invited_by UUID,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP
);
