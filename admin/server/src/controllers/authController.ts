import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { supabase, supabaseAdmin } from '../config/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user exists in admin_users table
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Database error:', error)
      // If table doesn't exist yet, fall back to mock authentication
      if (error.code === 'PGRST116') {
        // Table doesn't exist, use mock auth
        if (email === 'admin@rescuebite.in') {
          const token = jwt.sign(
            { email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '1h' }
          )

          return res.json({
            message: 'Login successful',
            token,
            user: {
              email,
              role: 'admin'
            }
          })
        }
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      return res.status(500).json({ error: 'Database error' })
    }

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password - compare with stored hash if exists, otherwise allow admin@rescuebite.in
    let passwordValid = false
    if (adminUser.password) {
      // Compare with hashed password (when password field exists)
      passwordValid = password === adminUser.password // Simple comparison for now
    } else {
      // Fallback: allow admin@rescuebite.in without password check
      if (email === 'admin@rescuebite.in') {
        passwordValid = true
      }
    }

    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last_login and login_count (only if user exists in database)
    if (adminUser.id) {
      await supabaseAdmin
        .from('admin_users')
        .update({
          last_login: new Date().toISOString(),
          login_count: (adminUser.login_count || 0) + 1
        })
        .eq('id', adminUser.id)
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: adminUser.email,
        role: 'admin',
        userId: adminUser.user_id
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        email: adminUser.email,
        role: 'admin',
        userId: adminUser.user_id
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
