-- ========================================
-- Create admin_users Table and Add Admin User
-- ========================================
-- Run this in your Supabase SQL Editor
-- ========================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  password TEXT, -- Added password field
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow authenticated admins to view all admin users
CREATE POLICY "Admins can view all admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE auth.uid() = user_id AND is_active = true
    )
  );

-- Create policy: Allow authenticated admins to update admin users
CREATE POLICY "Admins can update admin users" ON admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE auth.uid() = user_id AND is_active = true
    )
  );

-- Create policy: Allow authenticated admins to insert admin users
CREATE POLICY "Admins can create admin users" ON admin_users
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE auth.uid() = created_by AND is_active = true
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users
  FOR EACH ROW 
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert admin user (after you create user in Supabase Auth)
-- This will insert the admin user if they exist in auth.users but not in admin_users
INSERT INTO admin_users (user_id, email, password, created_by)
SELECT 
  id,
  email,
  'admin123456789012345', -- Plain text password (simple for now)
  id  -- self-referencing for first admin
FROM auth.users 
WHERE email = 'admin@rescuebite.in'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE email = 'admin@rescuebite.in'
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'admin_users table created successfully with password field!';
  RAISE NOTICE 'Admin user created: admin@rescuebite.in';
  RAISE NOTICE 'Login with: admin123456789012345';
END;
$$;
