import * as dotenv from 'dotenv'
dotenv.config()
import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import kycRoutes from './routes/kyc'
import listingsRoutes from './routes/listings'
import statsRoutes from './routes/stats'
import logsRoutes from './routes/logs'

const app: Express = express()
const PORT = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'

// Middleware
app.use(helmet()) // Security headers
app.use(morgan(isProd ? 'combined' : 'dev')) // Logging

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://rescue-bite-admin.vercel.app' // Add your production frontend URL here
].filter(Boolean) as string[]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    // In development, allow anything from localhost
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')

    if (isProd) {
      // Check if it's in the explicitly allowed list
      const isAllowedExplicitly = allowedOrigins.indexOf(origin) !== -1

      // Also allow common deployment domains for flexibility (e.g. any .onrender.com or .vercel.app)
      const isCommonDeploymentDomain = origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')

      if (isAllowedExplicitly || isCommonDeploymentDomain || isLocalhost) {
        callback(null, true)
      } else {
        // Logging the denied origin for debugging in production
        console.warn(`CORS denied for origin: ${origin}`)
        callback(new Error('Not allowed by CORS'))
      }
    } else {
      callback(null, true)
    }
  },
  credentials: true,
}))

app.use(express.json())

// Routes
app.use('/api/admin/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/kyc', kycRoutes)
app.use('/api/listings', listingsRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/logs', logsRoutes)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  })
})

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' })
})

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(isProd ? {} : { stack: err.stack })
  })
})

// Vercel serverless function export
const handler = (req: any, res: any) => {
  return app(req, res)
}

export default handler

// Always listen on PORT for non-serverless environments (like Render)
// Vercel handles the handler export, but Render needs the server to listen.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})
