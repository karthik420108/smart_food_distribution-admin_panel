import express from 'express'
import { login } from '../controllers/authController'

const router = express.Router()

// POST /api/admin/auth/login
router.post('/login', login)

export default router
