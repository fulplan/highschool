# Shawarma Boss POS - MERN Stack

A complete Point of Sale (POS) system built with the MERN stack (MongoDB/PostgreSQL, Express.js, React, Node.js) featuring real-time inventory management, JWT authentication, and role-based access control.

## 🚀 Features

- **Frontend**: React with Tailwind CSS for modern, responsive UI
- **Backend**: Express.js REST API with PostgreSQL database
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Real-time Inventory**: Live stock management and low stock alerts
- **Role-based Access**: Admin and staff roles with different permissions
- **Order Management**: Complete order processing with receipt generation
- **User Management**: Full CRUD operations for admin/staff management
- **Business Settings**: Configurable tax rates and business settings

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, JavaScript ES6+
- **Backend**: Node.js, Express.js, PostgreSQL, JWT
- **Database**: PostgreSQL with proper relations and constraints
- **Authentication**: bcrypt for password hashing, JWT for sessions
- **Development**: Nodemon for hot reload, Concurrently for dev scripts

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shawarma-boss-mern
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   NODE_ENV=development
   ```

   The `client/.env` file is already configured:
   ```env
   PORT=5000
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Database Setup**
   
   The application will automatically create the required tables on first run.

5. **Start Development**
   ```bash
   npm run dev
   ```

   This command will start:
   - Backend API server on http://localhost:8000
   - React frontend on http://localhost:5000

## 📝 Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the React frontend
- `npm run server` - Start only the Express backend
- `npm run build` - Build the React app for production
- `npm start` - Start the production server
- `npm run install-all` - Install dependencies for both client and server

## 🔐 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Super Admin (full access)

### Staff Account
- **Username**: `staff1`
- **Password**: `staff123`
- **Role**: Staff (limited access)

> **⚠️ Important**: Change these default passwords on first login in production!

## 🏗️ Project Structure

```
shawarma-boss-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.js
│   │   │   ├── Menu.js
│   │   │   └── Cart.js
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── App.js         # Main App component
│   │   └── App.css        # Tailwind CSS styles
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies
├── backend/               # Express backend
│   ├── server.js          # Main server file
│   ├── .env              # Environment variables
│   └── package.json      # Server dependencies
├── package.json          # Root package.json with dev scripts
└── README.md             # This file
```

## 🔄 API Endpoints

### Authentication
- `POST /login` - User authentication
- `GET /health` - Health check

### Menu Management
- `GET /menu` - Get all menu items
- `POST /menu` - Create new menu item (Admin only)
- `PUT /menu/:id` - Update menu item (Admin only)
- `DELETE /menu/:id` - Delete menu item (Admin only)

### Order Management
- `GET /orders` - Get orders (role-based filtering)
- `POST /orders` - Create new order
- `GET /orders/:id` - Get specific order
- `PUT /orders/:id/status` - Update order status

### User Management
- `GET /users` - Get all users (Admin only)
- `POST /users` - Create new user (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Deactivate user (Super Admin only)

## 🎯 Development

### Frontend Development

The React frontend uses:
- **Tailwind CSS** for styling
- **Functional components** with React Hooks
- **API service layer** for backend communication
- **Real-time updates** for inventory and orders

### Backend Development

The Express backend features:
- **RESTful API** design
- **JWT middleware** for authentication
- **Role-based authorization**
- **PostgreSQL** with connection pooling
- **Transaction support** for order processing
- **Input validation** and error handling

### Database Schema

The PostgreSQL database includes:
- `users` - User accounts and roles
- `menu_items` - Product catalog with inventory
- `orders` - Order records
- `order_items` - Order line items
- `business_settings` - Configurable settings

## 🚀 Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your_production_db_url
   export JWT_SECRET=your_secure_jwt_secret
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API endpoints documentation
- Review the development logs for troubleshooting

---

**Built with ❤️ using the MERN Stack**