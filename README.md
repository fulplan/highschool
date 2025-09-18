# Shawarma Boss POS - PERN Stack

A modern, full-stack Point of Sale (POS) system built with the PERN stack (PostgreSQL, Express.js, React, Node.js). Originally a vanilla JavaScript PWA, now transformed into a powerful, scalable web application optimized for cloud deployment on Replit.

## 🚀 Features

### Core POS Functionality
- **User Authentication**: Secure login system with role-based access (Admin/Staff)
- **Menu Management**: Dynamic menu with real-time stock tracking
- **Order Processing**: Complete order workflow with cart management
- **Receipt Generation**: Print and PDF receipt capabilities
- **Sales Tracking**: Comprehensive sales reporting and analytics
- **Stock Management**: Real-time inventory tracking with low-stock alerts

### Modern Architecture
- **React Frontend**: Component-based UI with modern hooks and context
- **Express.js Backend**: RESTful API with proper error handling
- **PostgreSQL Database**: Robust relational database with ACID compliance
- **Responsive Design**: Mobile-first design that works on all devices
- **Hot Reloading**: Development server with automatic rebuilds

### Enhanced Admin Features
- **Advanced Staff Management**: Add/view staff with role assignment and sales performance tracking
- **Real-time Menu Management**: Create menu items and update stock levels instantly with visual status indicators
- **Comprehensive Sales Analytics**: Dashboard with total/daily sales, order counts, and staff performance metrics
- **Enhanced Stock Management**: Inline stock updates with immediate feedback and low-stock alerts
- **Professional UI/UX**: Bootstrap 5 integration with success/error notifications and responsive design
- **Data Export & Reports**: JSON/CSV export functionality with comprehensive order history
- **Visual Stock Alerts**: Real-time notifications for low inventory with status badges (OK/Low/Out)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with Flexbox/Grid
- **Bootstrap 5** - Responsive component library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Build Tools
- **Webpack** - Module bundler
- **Babel** - JavaScript transpiler
- **npm** - Package manager

## 📋 Prerequisites

### For Local Development
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### For Replit (Recommended)
- No local installations required - add a PostgreSQL database via the Database tab

## 🚀 Quick Start

### Option A: Replit (Recommended)

1. **Fork this repository** on Replit or import from GitHub
2. **Add PostgreSQL Database**: Use the "Database" tab in Replit to add a PostgreSQL database (automatically sets DATABASE_URL)
3. **Install dependencies**: Dependencies will be automatically installed on first run
4. **Click Run** - The application will build and start automatically
5. **Access the app** via the Replit webview

**Note**: The PostgreSQL database and tables will be automatically created and seeded with default data on first run.

### Option B: Local Development

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd shawarma-boss-mern

# Install dependencies
npm install
```

#### 2. Database Setup

```bash
# Create database
createdb shawarma_boss

# Copy environment file (create .env file)
echo "PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=shawarma_boss" > .env
```

#### 3. Start the Application

```bash
# Production mode (builds React app and starts server)
npm start

# Development mode (for development only)
npm run dev

# Build production assets only
npm run build
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
shawarma-boss-mern/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── Login.js       # Authentication component
│   │   ├── POS.js         # Main POS interface
│   │   ├── Admin.js       # Admin dashboard
│   │   ├── Header.js      # Navigation header
│   │   ├── Cart.js        # Shopping cart
│   │   ├── MenuGrid.js    # Menu display
│   │   └── OrderModal.js  # Order receipt modal
│   ├── services/          # API and state management
│   │   ├── api.js         # API client
│   │   ├── AuthContext.js # Authentication context
│   │   └── CartContext.js # Cart state management
│   ├── App.js             # Main React component
│   ├── App.css            # Application styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles and utilities
├── public/                # Static assets
│   └── index.html         # HTML template
├── dist/                  # Built React application (auto-generated)
├── icons/                 # Application icons and logo
├── server.js              # Unified Express.js server (frontend + API)
├── webpack.config.js      # Webpack configuration
├── package.json           # Dependencies and scripts
├── replit.md             # Project documentation and architecture
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `GET /api/health` - Server health check

### User Management
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Add new staff member

### Menu Management
- `GET /api/menu` - Get menu items
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id/stock` - Update item stock

### Orders
- `GET /api/orders` - Get order history
- `POST /api/orders` - Create new order

## 👥 Default Users

The application comes with default users for testing:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| staff1 | staff123 | staff |

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    meta JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Menu Table
```sql
CREATE TABLE menu (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    meta JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    staff VARCHAR(50),
    timestamp TIMESTAMP DEFAULT NOW(),
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    payload JSONB,
    server_received_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (staff) REFERENCES users(username)
);
```

## 🚀 Deployment

### Replit Deployment (Recommended)
This application is fully optimized for Replit deployment:

1. **Database Setup**: Add PostgreSQL database via Replit's Database tab (sets DATABASE_URL automatically)
2. **One-Click Deploy**: Use the "Deploy" button in Replit for instant production deployment
3. **Autoscale Configuration**: Configure autoscale target in Replit's Deploy settings for automatic scaling
4. **Build Process**: `npm run build` → `node server.js`
5. **CORS Enabled**: Properly configured for Replit's proxy environment

### Manual Deployment
For other platforms, ensure the following environment variables are set:

```bash
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
PORT=5000
PGHOST=your_host
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database
```

## 🔧 Development

### Available Scripts

- `npm start` - Build and start production server (used by Replit)
- `npm run dev` - Start development server (development only)
- `npm run build` - Build React app for production
- `npm run build:dev` - Build React app for development

### Development Workflow

#### On Replit (Recommended)
1. Make changes to React components in `src/` or backend in `server.js`
2. The app automatically rebuilds and restarts
3. View changes instantly in the Replit webview

#### Local Development
1. Start the development server: `npm run dev`
2. Make changes to React components in `src/`
3. The build process automatically rebuilds the app
4. Server restarts automatically on backend changes

### Important Notes
- **Price Handling**: All price values from PostgreSQL are strings and must be converted with `parseFloat()` before using `.toFixed()`
- **CORS**: Application is configured to work with Replit's proxy environment
- **Database**: Automatic table creation and seeding on first run

## 📊 Features in Detail

### Role-Based Access Control
- **Staff**: Can only view their own sales and process orders
- **Admin**: Full access to all features including user management and analytics

### Advanced Real-Time Stock Management
- **Inline Stock Updates**: Administrators can update stock levels directly from the menu management panel
- **Visual Stock Indicators**: Color-coded badges showing stock status (Green=OK, Yellow=Low, Red=Out)
- **Automatic Stock Deduction**: Stock levels automatically decrease when orders are processed
- **Low Stock Alerts**: Immediate notifications when items reach ≤5 units with dedicated alerts section
- **Real-time Feedback**: Success/error notifications for all stock operations with auto-dismissing alerts
- **Stock Status Prevention**: System prevents orders when items are out of stock

### Sales Analytics
- Real-time sales dashboard
- Sales by staff member
- Daily/total sales tracking
- Order history with detailed breakdown

### Data Export
- JSON export of all data (users, menu, orders)
- CSV export of orders for external analysis
- Data backup capabilities for external storage

## 🔒 Security Features

- Password-based authentication
- Role-based route protection
- SQL injection prevention with parameterized queries
- CORS configuration for secure cross-origin requests
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## ✅ Recent Enhancements (Latest Update)

### v2.1.0 - Replit Optimization & Bug Fixes
- [x] **Replit Environment Optimization**: Fully configured for seamless deployment on Replit
- [x] **Critical Bug Fixes**: Resolved PostgreSQL DECIMAL string handling causing blank pages
- [x] **Price Formatting**: Fixed all `.toFixed()` errors with proper `parseFloat()` handling
- [x] **Logo Optimization**: Improved login page logo sizing and layout
- [x] **Database Integration**: Automatic PostgreSQL setup with proper environment configuration
- [x] **CORS Configuration**: Optimized for Replit's proxy environment
- [x] **Error Handling**: Comprehensive error handling for all price calculations

### v2.0.0 - Enhanced Admin Dashboard
- [x] **Enhanced Admin Dashboard**: Complete redesign with Bootstrap 5 integration
- [x] **Real-time Stock Updates**: Inline stock modification with immediate visual feedback
- [x] **Advanced Notification System**: Success/error alerts with auto-dismiss functionality
- [x] **Improved Stock Management**: Visual status indicators and comprehensive alerts
- [x] **Professional UI/UX**: Modern responsive design with Font Awesome icons
- [x] **Enhanced Sales Analytics**: Comprehensive dashboard with staff performance tracking

## 🐛 Known Issues & Solutions

### Troubleshooting
- **Blank Page Issues**: If you encounter blank pages, ensure all price values are properly handled with `parseFloat()` before `.toFixed()`
- **Database Connection**: PostgreSQL connection is automatic on Replit; for local development, ensure PostgreSQL is running
- **Build Errors**: Run `npm install` to ensure all dependencies are installed
- **CORS Issues**: The app is pre-configured for Replit's proxy environment

## 🎯 Future Roadmap

- [ ] JWT-based authentication with refresh tokens
- [ ] Password hashing with bcrypt
- [ ] Real-time WebSocket notifications
- [ ] Multi-location support
- [ ] Advanced reporting with charts and graphs
- [ ] Mobile app (React Native)
- [ ] Integration with payment processors (Stripe, PayPal)
- [ ] Barcode scanning support
- [ ] Inventory forecasting and automated reordering
- [ ] Multi-currency support
- [ ] Dark mode theme

---

**Built with ❤️ using the PERN Stack**