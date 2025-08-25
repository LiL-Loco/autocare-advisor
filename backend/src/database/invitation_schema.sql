-- CL-16: Database Schema Extension for Invitation System
-- Create user_invitations table

CREATE TABLE user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'partner',
    invited_by UUID REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for user_invitations
CREATE INDEX idx_user_invitations_token ON user_invitations(invitation_token);
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_status ON user_invitations(status);
CREATE INDEX idx_user_invitations_expires_at ON user_invitations(expires_at);
CREATE INDEX idx_user_invitations_invited_by ON user_invitations(invited_by);

-- Extend users table for invitation tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP;

-- Create trigger for updated_at on user_invitations
CREATE TRIGGER update_user_invitations_updated_at 
    BEFORE UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
