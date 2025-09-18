// Unified MERN Server - Serves both frontend and API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

// PostgreSQL configuration
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.PGURL || 
  `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'shawarma_boss'}`;

const app = express();

// Enable CORS for all origins (required for Replit proxy)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files from dist directory (built React app)
app.use(express.static(path.join(__dirname, 'dist')));

// Serve legacy static files (icons, manifest, etc.)
app.use(express.static(path.join(__dirname)));

// PostgreSQL Database setup
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database tables and default data
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(50) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staff',
        meta JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        meta JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        staff VARCHAR(50),
        timestamp TIMESTAMP DEFAULT NOW(),
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        payload JSONB,
        server_received_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (staff) REFERENCES users(username)
      )
    `);

    // Create indexes for better performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_staff ON orders(staff)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_menu_stock ON menu(stock)`);

    // Insert default data if tables are empty
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'staff1', password: 'staff123', role: 'staff' }
      ];
      
      for (const user of defaultUsers) {
        await pool.query(
          'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
          [user.username, user.password, user.role]
        );
      }
      console.log('✅ Default users created');
    }

    const menuCount = await pool.query('SELECT COUNT(*) as count FROM menu');
    if (parseInt(menuCount.rows[0].count) === 0) {
      const defaultMenu = [
        { id: 'm-1', name: 'Shawarma Wrap', price: 20, stock: 25 },
        { id: 'm-2', name: 'Chicken Shawarma', price: 25, stock: 20 },
        { id: 'm-3', name: 'Beef Shawarma', price: 28, stock: 18 }
      ];
      
      for (const item of defaultMenu) {
        await pool.query(
          'INSERT INTO menu (id, name, price, stock) VALUES ($1, $2, $3, $4)',
          [item.id, item.name, item.price, item.stock]
        );
      }
      console.log('✅ Default menu items created');
    }

    console.log('🗄️ PostgreSQL database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Initialize database on startup
initializeDatabase();

// Helper function for database queries
async function queryDB(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// API Routes
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    res.json({ 
      ok: true, 
      message: 'Shawarma Boss MERN Server Running', 
      database: 'PostgreSQL',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Username and password required' });
    }
    
    const users = await queryDB('SELECT username, role FROM users WHERE username = $1 AND password = $2', 
                                [username, password]);
    const user = users[0];
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }
    
    res.json({ ok: true, username: user.username, role: user.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Get staff/users
app.get('/api/staff', async (req, res) => {
  try {
    const users = await queryDB('SELECT username, role, meta FROM users ORDER BY created_at');
    const mapped = users.map(u => ({
      username: u.username,
      role: u.role,
      meta: u.meta || null
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add staff user
app.post('/api/staff', async (req, res) => {
  try {
    const { username, password, role = 'staff' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    await queryDB('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', 
                   [username, password, role]);
    res.json({ ok: true, username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get menu
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await queryDB('SELECT id, name, price, stock, meta FROM menu ORDER BY created_at');
    const mapped = menu.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      meta: item.meta || null
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add menu item
app.post('/api/menu', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Name, price, and stock required' });
    }
    
    const id = 'm-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    await queryDB('INSERT INTO menu (id, name, price, stock) VALUES ($1, $2, $3, $4)', 
                   [id, name, parseFloat(price), parseInt(stock)]);
    res.json({ ok: true, id, name, price, stock });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update menu item stock
app.put('/api/menu/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    await queryDB('UPDATE menu SET stock = $1, updated_at = NOW() WHERE id = $2', [parseInt(stock), id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get orders/sales
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await queryDB('SELECT id, staff, timestamp, total, payload, server_received_at FROM orders ORDER BY server_received_at DESC LIMIT 500');
    const mapped = orders.map(o => ({
      id: o.id,
      staff: o.staff,
      timestamp: o.timestamp,
      total: o.total,
      payload: o.payload || null,
      serverReceivedAt: o.server_received_at
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add order
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.id) {
      return res.status(400).json({ error: 'Order with ID required' });
    }
    
    const payload = order;
    const serverReceivedAt = new Date().toISOString();
    
    await queryDB('INSERT INTO orders (id, staff, timestamp, total, payload, server_received_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
                   [order.id, order.user || order.staff || '', order.timestamp || new Date().toISOString(), order.total || 0, JSON.stringify(payload), serverReceivedAt]);
    
    res.json({ ok: true, id: order.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Catch-all handler for React SPA routing (must be last)
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Skip static files
  if (req.path.includes('.')) {
    return next();
  }
  
  // Serve React app
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  if (require('fs').existsSync(distIndexPath)) {
    res.sendFile(distIndexPath);
  } else {
    // Fallback to legacy index.html if React app not built
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Shawarma Boss MERN Server running on http://0.0.0.0:${PORT}`);
  console.log(`🗄️ Database: PostgreSQL`);
  console.log(`🔗 API endpoints available at /api/*`);
  console.log(`📱 React app served from /dist`);
  console.log(`🔄 Environment: ${process.env.NODE_ENV || 'development'}`);
});