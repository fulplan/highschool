# HighSchoolive Africa 🎓✨

A modern, responsive MERN stack web application designed to empower African high school students through entertainment, education, and community engagement.

![HighSchoolive Africa](./client/public/img/high-logo.PNG)

## 🌟 Overview

HighSchoolive Africa is a dynamic platform that connects high school students across Africa through engaging content, exciting events, and meaningful community interactions. Built with cutting-edge technologies, the platform features a sleek React frontend and robust Express.js backend.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Interactive Animations**: Smooth Framer Motion animations and hover effects
- **Modern Styling**: Tailwind CSS with custom design system
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 🎯 Core Functionality
- **Event Management**: Browse, register, and participate in school events
- **Photo Gallery**: Interactive gallery with lightbox functionality
- **Team Profiles**: Meet the passionate team behind the platform
- **Contact System**: Advanced contact forms with validation
- **Newsletter**: Stay updated with the latest news and events

### 🔧 Technical Features
- **Real-time Updates**: Hot module replacement for instant development feedback
- **Form Validation**: Client-side validation with Zod schema validation
- **Performance Optimized**: Lazy loading, image optimization, and code splitting
- **SEO Friendly**: Optimized meta tags and structured data
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with hooks and functional components
- **Vite 7.1.5** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library for React
- **React Router DOM 7.8.2** - Declarative routing for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful & consistent icons
- **Sonner** - An opinionated toast component for React

### Backend
- **Express.js 5.1.0** - Fast, unopinionated web framework for Node.js
- **Node.js 20** - JavaScript runtime built on Chrome's V8 engine
- **CORS** - Cross-Origin Resource Sharing middleware
- **Dotenv** - Environment variable management
- **Mongoose 8.18.1** - MongoDB object modeling for Node.js

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Hot Module Replacement** - Instant development feedback
- **PostCSS** - Tool for transforming CSS with JavaScript

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- MongoDB (for database operations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/highschoolive-africa.git
   cd highschoolive-africa
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create environment file in server directory
   cd server
   cp .env.example .env
   
   # Add your environment variables
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start development servers**
   ```bash
   # Start backend server (Terminal 1)
   cd server
   npm run dev

   # Start frontend development server (Terminal 2)
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
highschoolive-africa/
├── client/                     # React frontend application
│   ├── public/                # Static assets
│   │   ├── img/              # Images and media files
│   │   └── video/            # Video content
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navigation.jsx    # Modern navigation with mobile menu
│   │   │   ├── Hero.jsx          # Landing section with animations
│   │   │   ├── About.jsx         # About section with stats
│   │   │   ├── WhyUs.jsx         # Features and benefits
│   │   │   ├── Events.jsx        # Event listings and booking
│   │   │   ├── Members.jsx       # Team member profiles
│   │   │   ├── Gallery.jsx       # Interactive photo gallery
│   │   │   ├── Contact.jsx       # Contact form with validation
│   │   │   ├── Footer.jsx        # Footer with newsletter signup
│   │   │   ├── Button.jsx        # Reusable button component
│   │   │   └── Card.jsx          # Reusable card component
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # Application entry point
│   │   ├── index.css         # Global styles with Tailwind
│   │   └── App.css           # Component-specific styles
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration
├── server/                    # Express backend application
│   ├── routes/               # API route handlers
│   ├── models/               # Database models (Mongoose)
│   ├── middleware/           # Custom middleware
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   └── .env.example          # Environment variables template
├── docs/                     # Documentation files
├── README.md                 # Project documentation
└── replit.md                 # Replit-specific documentation
```

## 🎨 Component Architecture

### Core Components

#### Navigation Component
- Modern sticky navigation with smooth scrolling
- Mobile-responsive hamburger menu
- Active section highlighting
- Smooth animations and transitions

#### Hero Section
- Eye-catching landing with gradient backgrounds
- Interactive play button with ripple effects
- Responsive typography and CTAs
- Floating animation elements

#### About Section
- Feature highlights with icons
- Interactive image hover effects
- Statistics counter animations
- Responsive grid layout

#### Events Section
- Event cards with detailed information
- Status badges and pricing
- Registration/booking functionality
- Responsive event grid

#### Gallery Component
- Interactive photo gallery with filters
- Lightbox modal for image viewing
- Hover effects and smooth transitions
- Responsive masonry layout

#### Contact Section
- Advanced form validation with Zod
- Real-time error handling
- Toast notifications for feedback
- Contact information cards

### Reusable Components

#### Button Component
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

#### Card Component
```jsx
<Card delay={0.2} hover={true}>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

## 🎭 Animation System

The application uses Framer Motion for smooth, performant animations:

- **Page Transitions**: Smooth entry animations for sections
- **Hover Effects**: Interactive button and card hover states
- **Scroll Animations**: Elements animate as they enter the viewport
- **Micro-interactions**: Button clicks, form submissions, and navigation

## 📱 Responsive Design

Built with a mobile-first approach using Tailwind CSS:

- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
  - Large Desktop: > 1280px

- **Features**:
  - Responsive navigation with mobile menu
  - Flexible grid layouts
  - Scalable typography
  - Touch-friendly interactions

## 🔧 API Endpoints

### Health & Info
- `GET /` - API information and status
- `GET /api/health` - Health check endpoint

### Communication
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/contact` - Contact form submission

### Example API Usage

```javascript
// Subscribe to newsletter
const subscribeToNewsletter = async (email) => {
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Subscription failed:', error);
  }
};
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--accent: #cda45e;           /* Golden accent */
--dark: #0c0b09;            /* Primary dark */
--dark-lighter: #1a1814;    /* Secondary dark */

/* Gradients */
--primary-gradient: linear-gradient(135deg, #cda45e, #f4d03f);
--dark-gradient: linear-gradient(135deg, #0c0b09, #1a1814);
```

### Typography
- **Headings**: Poppins (Bold, modern)
- **Body Text**: Open Sans (Clean, readable)
- **Accent Text**: Playfair Display (Elegant, serif)

### Spacing Scale
- **Base unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px

## 🚀 Deployment

### Development
```bash
# Frontend development server
cd client && npm run dev

# Backend development server
cd server && npm run dev
```

### Production Build
```bash
# Build frontend for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Start production server
cd server && npm start
```

### Replit Deployment
The application is configured for easy deployment on Replit:
- Automatic dependency management
- Environment variable configuration
- Port configuration for Replit hosting

## 🧪 Testing

### Manual Testing Checklist
- [ ] All navigation links work correctly
- [ ] Forms validate properly
- [ ] Images load and display correctly
- [ ] Animations are smooth and performant
- [ ] Mobile responsiveness works across devices
- [ ] Contact form sends messages successfully
- [ ] Newsletter subscription works
- [ ] Gallery lightbox functions properly

### Performance Testing
- [ ] Page load times under 3 seconds
- [ ] Smooth scrolling performance
- [ ] No layout shifts during loading
- [ ] Images lazy load properly
- [ ] Animations don't block user interaction

## 🔒 Security

- **Form Validation**: Client and server-side validation
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive data stored securely
- **Input Sanitization**: Protection against XSS attacks
- **Rate Limiting**: API endpoint protection (to be implemented)

## 🌍 Accessibility

- **WCAG 2.1 AA Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantics
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Visible focus indicators

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Images and components load on demand
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching Strategy**: Efficient caching headers

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- Use ESLint and Prettier for code formatting
- Follow React best practices and hooks patterns
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design for all components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern educational platforms and youth-focused websites
- **Icons**: Lucide React icon library
- **Fonts**: Google Fonts (Open Sans, Poppins, Playfair Display)
- **Images**: Community-provided photos from events and activities
- **Animation**: Framer Motion community examples

## 📞 Support

For support, email us at info.highschoolive@gmail.com or join our community discussions.

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Modern UI/UX design
- [x] Responsive layout
- [x] Interactive components
- [x] Contact and newsletter forms
- [x] Gallery functionality

### Phase 2 (Upcoming) 🚧
- [ ] User authentication system
- [ ] Event registration with payments
- [ ] User dashboard and profiles
- [ ] Real-time chat functionality
- [ ] Mobile app development

### Phase 3 (Future) 📋
- [ ] School partnership portal
- [ ] Content management system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] AI-powered content recommendations

---

**Built with ❤️ by the HighSchoolive Africa Team**

For more information, visit our website or contact us at info.highschoolive@gmail.com