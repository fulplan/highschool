import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'HighSchoolive Africa API',
    version: '1.0.0',
    status: 'Server running successfully'
  })
})

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Newsletter subscription endpoint
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  
  // Here you would typically save to database
  // For now, just return success
  res.json({ 
    message: 'Successfully subscribed to newsletter',
    email: email
  })
})

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  
  // Here you would typically save to database or send email
  // For now, just return success
  res.json({ 
    message: 'Contact form submitted successfully',
    data: { name, email, subject }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, 'localhost', () => {
  console.log(`HighSchoolive Africa API server running on http://localhost:${PORT}`)
})