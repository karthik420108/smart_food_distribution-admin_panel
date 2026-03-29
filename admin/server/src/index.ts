import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import kycRoutes from './routes/kyc'
import listingsRoutes from './routes/listings'
import statsRoutes from './routes/stats'
import logsRoutes from './routes/logs'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/admin/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/kyc', kycRoutes)
app.use('/api/listings', listingsRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/logs', logsRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// trigger restart