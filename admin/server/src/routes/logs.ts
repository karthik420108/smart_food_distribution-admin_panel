import express from 'express'
import { getAdminLogs } from '../controllers/logsController'

const router = express.Router()

router.get('/', getAdminLogs)

export default router
