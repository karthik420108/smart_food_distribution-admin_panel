import { Request, Response } from 'express'
import { supabaseAdmin as supabase } from '../config/database'

export const getAdminLogs = async (req: Request, res: Response) => {
    try {
        const { data: logs, error } = await supabase
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching logs:', error)
            return res.status(500).json({ error: 'Failed to fetch admin logs' })
        }

        res.json({ data: logs })
    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
