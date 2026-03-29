import { Request, Response } from 'express'
import { supabaseAdmin as supabase } from '../config/database'
import { logAdminAction } from '../utils/logger'

// Helper for consistent role judging across platform
const judgeRole = (au: any, donorProfile?: any, receiverProfile?: any) => {
  const meta = au.user_metadata || {}
  const metaRole = String(meta.role || '').toLowerCase()
  const org = String(meta.org_name || '').toLowerCase()

  if (metaRole === 'ngo_admin' || org.includes('ngo') || meta.org_name) return 'ngo_admin'
  if (metaRole === 'ngo_volunteer' || metaRole.includes('volunteer')) return 'ngo_volunteer'
  return 'donor'
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { type } = req.query // 'donor' | 'ngo_admin' | 'ngo_volunteer' | 'all'

    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError
    const authUsers = authData?.users || []

    const { data: donorData } = await supabase.from('donors').select('*')
    const { data: receiverData } = await supabase.from('receivers').select('*')

    const donorsMap = new Map<string, any>((donorData || []).map(d => [d.user_id, d]))
    const receiversMap = new Map<string, any>((receiverData || []).map(r => [r.user_id, r]))

    const unifiedUsers = authUsers.map(au => {
      const donor = donorsMap.get(au.id)
      const receiver = receiversMap.get(au.id)
      const platformRole = judgeRole(au, donor, receiver)

      return {
        id: au.id,
        name: au.user_metadata?.full_name || au.user_metadata?.org_name || au.email?.split('@')[0],
        email: au.email,
        role: platformRole,
        user_type: platformRole.startsWith('ngo') ? 'ngo' : 'donor',
        phone: au.user_metadata?.phone || donor?.phone || receiver?.phone || 'N/A',
        status: donor?.status || receiver?.status || 'Active',
        created_at: au.created_at,
        fssai_number: donor?.fssai_number || receiver?.fssai_number || 'N/A',
        gst_number: donor?.gst_number || receiver?.gst_number || 'N/A',
        extra: platformRole.replace('_', ' ').toUpperCase()
      }
    })

    let filtered = unifiedUsers
    if (type === 'donor') {
      filtered = unifiedUsers.filter(u => u.role === 'donor')
    } else if (type === 'ngo_admin') {
      filtered = unifiedUsers.filter(u => u.role === 'ngo_admin')
    } else if (type === 'ngo_volunteer') {
      filtered = unifiedUsers.filter(u => u.role === 'ngo_volunteer')
    } else if (type === 'ngo') {
      filtered = unifiedUsers.filter(u => u.role.startsWith('ngo'))
    }

    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    res.json({ users: filtered, count: filtered.length })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // Basic UUID validation to prevent Supabase error
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid User ID format' })
    }
    const { data, error } = await supabase.auth.admin.getUserById(id)
    const user = data?.user
    if (error || !user) return res.status(404).json({ error: 'User not found' })

    const { data: donor } = await supabase.from('donors').select('*').eq('user_id', id).maybeSingle()
    const { data: receiver } = await supabase.from('receivers').select('*').eq('user_id', id).maybeSingle()

    return res.json({
      user: {
        ...user,
        profile: donor || receiver || null,
        platform_role: judgeRole(user, donor, receiver)
      }
    })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid User ID format' })
    }
    const { status } = req.body

    // Scan both tables safely
    const { data: donor } = await supabase.from('donors').select('id').eq('user_id', id).maybeSingle()
    if (donor) {
      await supabase.from('donors').update({ status, updated_at: new Date().toISOString() }).eq('user_id', id)
      return res.json({ message: 'Status updated' })
    }
    const { data: receiver } = await supabase.from('receivers').select('id').eq('user_id', id).maybeSingle()
    if (receiver) {
      await supabase.from('receivers').update({ status, updated_at: new Date().toISOString() }).eq('user_id', id)
      return res.json({ message: 'Status updated' })
    }
    return res.status(404).json({ error: 'Profile not found' })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { data: authData } = await supabase.auth.admin.listUsers()
    const authUsers = authData?.users || []
    const { data: donors } = await supabase.from('donors').select('user_id, status')
    const { data: receivers } = await supabase.from('receivers').select('user_id, status')

    res.json({
      donors: {
        total: authUsers.filter(u => judgeRole(u) === 'donor').length,
        active: donors?.filter(d => ['active', 'verified'].includes(d.status)).length || 0,
        recent: 0
      },
      ngos: {
        total: authUsers.filter(u => judgeRole(u).startsWith('ngo')).length,
        active: (donors?.filter(d => d.status === 'verified').length || 0) + (receivers?.filter(r => r.status === 'active' || r.status === 'verified').length || 0),
        pending: authUsers.filter(u => judgeRole(u).startsWith('ngo') && !donors?.some(d => d.user_id === u.id) && !receivers?.some(r => r.user_id === u.id)).length
      }
    })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
