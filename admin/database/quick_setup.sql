-- ========================================
-- Quick Database Setup for RescueBite Admin
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
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create simple policy to allow all operations (for testing)
CREATE POLICY "Allow all operations on admin_users" ON admin_users
  FOR ALL USING (true);

-- Insert admin user
INSERT INTO admin_users (user_id, email, password, created_by)
SELECT 
  id,
  email,
  'admin123456789012345',
  id
FROM auth.users 
WHERE email = 'admin@rescuebite.in'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE email = 'admin@rescuebite.in'
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete! Admin user ready.';
  RAISE NOTICE 'Login: admin@rescuebite.in';
  RAISE NOTICE 'Password: admin123456789012345';
END;
$$;
