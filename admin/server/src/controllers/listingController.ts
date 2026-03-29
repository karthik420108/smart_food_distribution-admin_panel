import { Request, Response } from 'express'
import { supabaseAdmin as supabase } from '../config/database'
import { logAdminAction } from '../utils/logger'

export const getAllListings = async (req: Request, res: Response) => {
    try {
        const { data: listings, error } = await supabase
            .from('food_listings')
            .select(`
        *,
        donors (
          full_name,
          email
        )
      `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching listings:', error)
            return res.status(500).json({ error: 'Failed to fetch listings' })
        }

        res.json({ data: listings })
    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateListingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const { data: listing, error } = await supabase
            .from('food_listings')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating listing:', error)
            return res.status(500).json({ error: 'Failed to update listing status' })
        }

        await logAdminAction('Admin', `Updated listing status to ${status}`, id, 'food_listing')

        res.json({ message: 'Listing updated successfully', data: listing })
    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
