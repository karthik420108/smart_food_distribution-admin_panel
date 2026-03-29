import express from 'express'
import { getAllListings, updateListingStatus } from '../controllers/listingController'

const router = express.Router()

router.get('/', getAllListings)
router.put('/:id/status', updateListingStatus)

export default router
