# Technical Documentation - HighSchoolive Africa

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend Implementation](#frontend-implementation)
3. [Backend Implementation](#backend-implementation)
4. [Database Design](#database-design)
5. [API Documentation](#api-documentation)
6. [Development Workflow](#development-workflow)
7. [Deployment Guide](#deployment-guide)
8. [Performance Optimization](#performance-optimization)
9. [Security Implementation](#security-implementation)
10. [Testing Strategy](#testing-strategy)

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Express API    │───▶│   MongoDB       │
│   (Frontend)    │    │   (Backend)     │    │  (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        │              │  External APIs  │
        │              │  (Email, etc.)  │
        │              └─────────────────┘
        ▼
┌─────────────────┐
│   Static Assets │
│  (Images, etc.) │
└─────────────────┘
```

### Technology Stack

#### Frontend Stack
- **React 19.1.1**: Component library with hooks
- **Vite 7.1.5**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Router DOM**: Client-side routing
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Lucide React**: Icon library

#### Backend Stack
- **Express.js 5.1.0**: Web framework
- **Node.js 20**: Runtime environment
- **Mongoose**: MongoDB ODM
- **CORS**: Cross-origin middleware
- **Dotenv**: Environment management

## Frontend Implementation

### Component Structure
```
src/
├── components/
│   ├── Navigation.jsx    # Main navigation with mobile menu
│   ├── Hero.jsx         # Landing section with CTAs
│   ├── About.jsx        # About section with features
│   ├── WhyUs.jsx        # Value propositions
│   ├── Events.jsx       # Event listings
│   ├── Members.jsx      # Team profiles
│   ├── Gallery.jsx      # Photo gallery with lightbox
│   ├── Contact.jsx      # Contact form
│   ├── Footer.jsx       # Footer with newsletter
│   ├── Button.jsx       # Reusable button component
│   └── Card.jsx         # Reusable card component
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

### State Management
The application uses React's built-in state management:
- **useState**: Local component state
- **useEffect**: Side effects and lifecycle
- **useForm**: Form state management
- **Custom hooks**: Reusable logic patterns

### Styling Architecture
```css
/* Tailwind CSS Utility Classes */
.container { @apply mx-auto px-4 max-w-7xl; }
.section-padding { @apply py-20; }
.text-gradient { @apply bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent; }

/* Custom Component Classes */
@layer components {
  .btn-primary {
    @apply bg-accent hover:bg-accent/90 text-dark font-semibold px-6 py-3 rounded-full transition-all duration-300;
  }
}
```

### Animation Implementation
```jsx
// Framer Motion Animation Patterns
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Responsive Design Breakpoints
```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  }
}
```

## Backend Implementation

### Server Structure
```
server/
├── routes/
│   ├── health.js        # Health check routes
│   ├── contact.js       # Contact form routes
│   └── newsletter.js    # Newsletter routes
├── models/
│   ├── Contact.js       # Contact schema
│   └── Newsletter.js    # Newsletter schema
├── middleware/
│   ├── cors.js          # CORS configuration
│   ├── validation.js    # Request validation
│   └── errorHandler.js  # Error handling
└── server.js            # Main server file
```

### Express Server Configuration
```javascript
// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/newsletter', newsletterRoutes)

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### API Route Implementation
```javascript
// routes/contact.js
import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post('/', [
  body('name').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('subject').isLength({ min: 5 }).trim(),
  body('message').isLength({ min: 10 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, subject, message } = req.body
    
    // Save to database
    const contact = new Contact({ name, email, subject, message })
    await contact.save()
    
    // Send email notification (implement as needed)
    
    res.json({ message: 'Contact form submitted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
```

## Database Design

### MongoDB Schema Design
```javascript
// models/Contact.js
import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Contact', contactSchema)
```

### Data Flow
```
Client Form → Validation → API Route → Database → Response → Client Update
     ↓              ↓           ↓           ↓           ↓
  React Hook    Zod Schema   Express    MongoDB    Success/Error
   Form         Validation  Middleware   Storage     Notification
```

## API Documentation

### Endpoints Overview

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "uptime": 3600
}
```

#### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Hello, I have a question..."
}
```

**Response Success (200):**
```json
{
  "message": "Contact form submitted successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

**Response Error (400):**
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

#### Newsletter Subscription
```http
POST /api/newsletter
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response Success (200):**
```json
{
  "message": "Successfully subscribed to newsletter",
  "email": "user@example.com"
}
```

### Error Handling
```javascript
// Standard error response format
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "path": "/api/contact"
}
```

## Development Workflow

### Local Development Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd highschoolive-africa

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Environment setup
cp server/.env.example server/.env
# Edit .env with your configuration

# 4. Start development servers
npm run dev:client    # Frontend on port 5000
npm run dev:server    # Backend on port 3000
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create pull request for review
```

### Code Quality Tools
```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx}",
    "type-check": "tsc --noEmit"
  }
}
```

## Deployment Guide

### Replit Deployment
```yaml
# .replit
modules = ["web", "nodejs-20"]

[deployment]
run = ["cd", "client", "&&", "npm", "run", "preview"]
build = ["cd", "client", "&&", "npm", "run", "build"]
```

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
MONGODB_URI=mongodb://localhost:27017/highschoolive
EMAIL_SERVICE_API_KEY=your_email_api_key
```

### Build Process
```bash
# Production build
cd client
npm run build    # Creates dist/ folder with optimized assets
npm run preview  # Preview production build locally
```

## Performance Optimization

### Frontend Optimizations
```javascript
// Code splitting with React.lazy
const Gallery = React.lazy(() => import('./components/Gallery'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Gallery />
    </Suspense>
  )
}
```

### Image Optimization
```jsx
// Responsive images with multiple formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Security Implementation

### Input Validation
```javascript
// Client-side validation with Zod
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000)
})

// Server-side validation with express-validator
app.use('/api/contact', [
  body('name').escape().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  // ... other validations
])
```

### CORS Configuration
```javascript
app.use(cors({
  origin: [
    'http://localhost:5000',
    'https://your-domain.com'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit'

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many contact submissions, please try again later'
})

app.use('/api/contact', contactLimiter)
```

## Testing Strategy

### Unit Testing
```javascript
// Example component test
import { render, screen } from '@testing-library/react'
import Button from '../components/Button'

test('renders button with correct text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### Integration Testing
```javascript
// API endpoint test
import request from 'supertest'
import app from '../server'

describe('POST /api/contact', () => {
  test('should create contact submission', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Contact form submitted successfully')
  })
})
```

### End-to-End Testing
```javascript
// Cypress E2E test
describe('Contact Form', () => {
  it('should submit contact form successfully', () => {
    cy.visit('/contact')
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('Test message')
    cy.get('button[type="submit"]').click()
    cy.contains('Message sent successfully').should('be.visible')
  })
})
```

### Performance Testing
```bash
# Lighthouse CI for performance monitoring
npm install -g @lhci/cli
lhci autorun
```

## Monitoring and Analytics

### Error Tracking
```javascript
// Error boundary for React components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
```

### Performance Monitoring
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## Troubleshooting Guide

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### CORS Issues
```javascript
// Check CORS configuration in server
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}))
```

#### Database Connection
```javascript
// Check MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))
```

### Debug Tools
- **React Developer Tools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API request debugging
- **Console Logging**: Error tracking

---

This technical documentation provides comprehensive guidance for developers working on the HighSchoolive Africa platform. For additional support, please refer to the main README or contact the development team.