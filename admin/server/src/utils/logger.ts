import { supabaseAdmin as supabase } from '../config/database'

export const logAdminAction = async (admin_email: string, action: string, target_id: string, target_type: string) => {
    try {
        await supabase.from('admin_logs').insert([{
            admin_email,
            action,
            target_id,
            target_type
        }])
    } catch (error) {
        console.error('Failed to log admin action', error)
    }
}
