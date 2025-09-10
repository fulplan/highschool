# HighSchoolive Africa

## Overview

HighSchoolive Africa is a modern MERN stack web application featuring a React frontend and Express.js backend. The platform is designed for African high school students, providing entertainment content, event information, and community engagement. The application showcases a clean, responsive design with Bootstrap and is optimized for both development and production deployment.

## Recent Changes

**September 10, 2025**: Enhanced Navigation and Blog System
- Redesigned navigation bar with modern white background and HighSchoolive Africa branding
- Implemented center navigation with hover effects and Events dropdown menu
- Added prominent black "Book Event" button with professional styling
- Enhanced BlogCard component with Gen Z-friendly features (like/share buttons, dynamic animations, category badges)
- Upgraded Blog component with animated hero section, trending hashtags, and dynamic stats
- Improved accessibility with better color contrast and responsive design
- Added Framer Motion animations throughout for modern user experience

**January 10, 2025**: Complete conversion from PHP to MERN stack
- Migrated from PHP/Apache to React/Node.js architecture
- Restructured entire codebase into client/server folders
- Converted all PHP templates to React components
- Set up Express backend with RESTful API endpoints
- Configured modern development workflow with Vite

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture (Client)
- **Framework**: React 19.1.1 with modern hooks and functional components
- **Build Tool**: Vite 7.1.5 for fast development and optimized builds
- **Routing**: React Router DOM 7.8.2 for client-side navigation
- **Styling**: Bootstrap 5.3.0 via CDN with custom CSS
- **Development Server**: Configured on port 5000 with 0.0.0.0 host binding
- **Project Structure**: 
  - `client/src/components/` - Reusable React components
  - `client/src/pages/` - Page-level components
  - `client/public/` - Static assets (images, videos, icons)

### Backend Architecture (Server)
- **Framework**: Express.js 5.1.0 with ES modules
- **Runtime**: Node.js 20 with modern JavaScript features
- **Middleware**: CORS, express.json(), express.urlencoded()
- **API Design**: RESTful endpoints with JSON responses
- **Configuration**: Environment-based with dotenv
- **Port Configuration**: Localhost:3000 (configurable via env)

### Key API Endpoints
- `GET /` - API information and health status
- `GET /api/health` - System health check
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/contact` - Contact form submissions

### Project Structure
```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components (Header, Footer, etc.)
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── public/            # Static assets
│   │   ├── img/          # Images and media files
│   │   └── video/        # Video content
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Express backend application
│   ├── routes/           # API route handlers
│   ├── models/           # Database models (Mongoose)
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
└── replit.md             # Project documentation
```

### Component Architecture
- **Header.jsx**: Navigation and branding
- **Hero.jsx**: Landing section with video integration
- **About.jsx**: Organization information and mission
- **WhyUs.jsx**: Value propositions and benefits
- **Events.jsx**: Event listings and booking
- **Members.jsx**: Team member profiles
- **Gallery.jsx**: Photo gallery with lightbox
- **Contact.jsx**: Contact form and information
- **Footer.jsx**: Footer links and newsletter signup

## Dependencies

### Frontend Dependencies
- **React 19.1.1**: Core library with modern hooks
- **React DOM 19.1.1**: DOM rendering
- **React Router DOM 7.8.2**: Client-side routing
- **Vite 7.1.5**: Build tool and development server
- **@vitejs/plugin-react 5.0.2**: React integration for Vite

### Backend Dependencies
- **Express 5.1.0**: Web framework
- **CORS 2.8.5**: Cross-origin resource sharing
- **Dotenv 17.2.2**: Environment variable management
- **Mongoose 8.18.1**: MongoDB object modeling

### External Resources
- **Bootstrap 5.3.0**: CSS framework via CDN
- **Bootstrap Icons**: Icon library
- **Boxicons**: Additional icon set
- **Google Fonts**: Open Sans, Playfair Display, Poppins

## Development Workflow
- **Frontend**: `cd client && npm run dev` (Port 5000)
- **Backend**: `cd server && npm run dev` (Port 3000)
- **Build**: `cd client && npm run build`
- **Preview**: `cd client && npm run preview`

## Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build Command**: Vite build process
- **Serve Command**: Vite preview for production