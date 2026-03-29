import { Request, Response } from 'express'
import { supabaseAdmin as supabase } from '../config/database'
import { logAdminAction } from '../utils/logger'

const judgeRole = (au: any, donorProfile?: any, receiverProfile?: any) => {
    const meta = au.user_metadata || {}
    const metaRole = String(meta.role || '').toLowerCase()
    const org = String(meta.org_name || '').toLowerCase()
    if (metaRole === 'ngo_admin' || org.includes('ngo') || meta.org_name) return 'ngo_admin'
    if (metaRole === 'ngo_volunteer' || metaRole.includes('volunteer')) return 'ngo_volunteer'
    return 'donor'
}

export const getPendingKyc = async (req: Request, res: Response) => {
    try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) throw authError
        const authUsers = authData?.users || []

        const { data: donors } = await supabase.from('donors').select('*')
        const { data: receivers } = await supabase.from('receivers').select('*')

        const donorsMap = new Map((donors || []).map(d => [d.user_id, d]))
        const receiversMap = new Map((receivers || []).map(r => [r.user_id, r]))

        const pendingList = authUsers.filter(au => {
            const donor = donorsMap.get(au.id)
            const receiver = receiversMap.get(au.id)
            const profile = donor || receiver

            // EXCLUDE anyone already processed (Verified, Rejected, or Active)
            if (profile && (profile.status === 'verified' || profile.status === 'active' || profile.status === 'rejected' || profile.status === 'notverified')) {
                return false;
            }

            // EXCLUDE NGO Volunteers (they are added by admins and pre-verified)
            const pRole = judgeRole(au, donor, receiver)
            if (pRole === 'ngo_volunteer') return false;

            return true;
        }).map(au => {
            const donor = donorsMap.get(au.id)
            const receiver = receiversMap.get(au.id)
            const platformRole = judgeRole(au, donor, receiver)
            return {
                id: au.id,
                full_name: au.user_metadata?.full_name || au.user_metadata?.org_name || au.email?.split('@')[0],
                email: au.email,
                phone: au.user_metadata?.phone || donor?.phone || receiver?.phone || 'N/A',
                status: donor?.status || receiver?.status || 'no_profile',
                created_at: au.created_at,
                platform_role: platformRole,
                role: platformRole,
                fssai_number: donor?.fssai_number || receiver?.fssai_number || 'N/A',
                gst_number: donor?.gst_number || receiver?.gst_number || 'N/A',
                kyc_document_url: donor?.kyc_document_url || receiver?.kyc_document_url || null,
                selfie_url: donor?.selfie_url || receiver?.selfie_url || null,
                user_source: donor ? 'donor' : (receiver ? 'receiver' : (platformRole.startsWith('ngo') ? 'receiver' : 'donor'))
            }
        })

        const ngos = pendingList.filter(u => u.platform_role.startsWith('ngo'))
        const individuals = pendingList.filter(u => u.platform_role === 'donor')

        res.json({ data: { donors: individuals, receivers: ngos } })
    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({ error: 'Internal error' })
    }
}

export const reviewKyc = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { status, user_type: incomingType } = req.body

        console.log(`Processing KYC ${status} for ID: ${id}, type: ${incomingType}`);

        const isNgo = (incomingType === 'receivers' || incomingType === 'receiver')
        const targetTable = isNgo ? 'receivers' : 'donors'
        const newStatus = (status === 'verified') ? 'verified' : 'rejected'

        const { data: dProfile } = await supabase.from('donors').select('id').eq('user_id', id).maybeSingle()
        const { data: rProfile } = await supabase.from('receivers').select('id').eq('user_id', id).maybeSingle()

        const finalTable = dProfile ? 'donors' : (rProfile ? 'receivers' : targetTable)

        if (dProfile || rProfile) {
            console.log(`Updating ${finalTable} to ${newStatus}`);
            const { error: upErr } = await supabase.from(finalTable).update({ status: newStatus }).eq('user_id', id)
            if (upErr) throw upErr
        } else {
            console.log(`Creating profile in ${finalTable}`);
            const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(id)
            if (authErr) throw authErr

            const user = authUser?.user
            const meta = user?.user_metadata || {}

            const insertData = {
                user_id: id,
                email: user?.email,
                full_name: meta.full_name || meta.org_name || user?.email?.split('@')[0],
                phone: meta.phone || 'N/A',
                status: newStatus,
                created_at: new Date().toISOString()
            }

            const { error: inErr } = await supabase.from(finalTable).insert([insertData])
            if (inErr) throw inErr
        }

        await logAdminAction('Admin', `KYC ${status} for ${id}`, id, finalTable)
        res.json({ message: 'Success' })
    } catch (error) {
        console.error('KYC Review Crash:', error)
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown backend error' })
    }
}
