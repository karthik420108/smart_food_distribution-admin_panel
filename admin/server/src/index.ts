import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
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

// API Routes
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

// Serve static files from the React app if in production
// On Render, we'll build the client and the server.
const clientPath = path.join(__dirname, '../../client/dist')
app.use(express.static(clientPath))

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' })
  }
  res.sendFile(path.join(clientPath, 'index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Export for serverless environments (like Vercel) if needed
export default app