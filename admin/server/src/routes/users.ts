import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  getUserStats
} from '../controllers/userController'

const router = express.Router()

// GET /api/users - Get all users with optional type filter
router.get('/', getAllUsers)

// GET /api/users/stats - Get user statistics
router.get('/stats', getUserStats)

// PUT /api/users/:id/status - Update user status
router.put('/:id/status', updateUserStatus)

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById)

export default router
