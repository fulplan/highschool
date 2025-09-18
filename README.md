# Shawarma Boss POS - MERN Stack

A modern, full-stack Point of Sale (POS) system built with the MERN stack (MongoDB/PostgreSQL, Express.js, React, Node.js). Originally a vanilla JavaScript PWA, now transformed into a powerful, scalable web application.

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

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb shawarma_boss

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=shawarma_boss
```

#### Option B: Replit PostgreSQL
If you're using Replit, the PostgreSQL database will be automatically configured. No additional setup required.

### 3. Start the Application

```bash
# Development mode (builds React app and starts server)
npm start

# Development with hot reload
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
│   │   └── MenuGrid.js    # Menu display
│   ├── services/          # API and state management
│   │   ├── api.js         # API client
│   │   ├── AuthContext.js # Authentication context
│   │   └── CartContext.js # Cart state management
│   ├── App.js             # Main React component
│   └── index.js           # React entry point
├── public/                # Static assets
│   └── index.html         # HTML template
├── dist/                  # Built React application
├── icons/                 # Application icons
├── server.js              # Express.js server
├── webpack.config.js      # Webpack configuration
├── .babelrc              # Babel configuration
├── package.json          # Dependencies and scripts
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

### Replit Deployment
This application is configured for easy deployment on Replit:

1. The deployment is configured to use `autoscale` target
2. Build command: `npm run build`
3. Run command: `node server.js`
4. PostgreSQL database is automatically configured

### Production Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

## 🔧 Development

### Available Scripts

- `npm start` - Build and start production server
- `npm run dev` - Start development server
- `npm run build` - Build React app for production
- `npm run build:dev` - Build React app for development

### Development Workflow

1. Start the development server: `npm run dev`
2. Make changes to React components in `src/`
3. The build process automatically rebuilds the app
4. Server restarts automatically on backend changes

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
- Backup and restore functionality

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

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## ✅ Recent Enhancements (Latest Update)

- [x] **Enhanced Admin Dashboard**: Complete redesign with Bootstrap 5 integration
- [x] **Real-time Stock Updates**: Inline stock modification with immediate visual feedback
- [x] **Advanced Notification System**: Success/error alerts with auto-dismiss functionality
- [x] **Improved Stock Management**: Visual status indicators and comprehensive alerts
- [x] **Performance Optimizations**: Fixed price formatting issues and improved error handling
- [x] **Professional UI/UX**: Modern responsive design with Font Awesome icons
- [x] **Enhanced Sales Analytics**: Comprehensive dashboard with staff performance tracking

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

---

**Built with ❤️ using the MERN Stack**