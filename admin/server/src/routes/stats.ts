import express from 'express'
import { getDashboardStats } from '../controllers/statsController'

const router = express.Router()

router.get('/dashboard', getDashboardStats)

export default router
