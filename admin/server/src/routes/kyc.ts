import express from 'express'
import { getPendingKyc, reviewKyc } from '../controllers/kycController'

const router = express.Router()

router.get('/pending', getPendingKyc)
router.put('/:id/review', reviewKyc)

export default router
