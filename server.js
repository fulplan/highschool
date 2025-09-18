// Unified MERN Server - Serves both frontend and API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 5000;
const DB_FILE = process.env.DB_FILE || 'orders.db';

const app = express();

// Enable CORS for all origins (required for Replit proxy)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files from root directory (frontend)
app.use(express.static(path.join(__dirname)));

// Database setup
const dbPath = path.join(__dirname, DB_FILE);
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create tables if they don't exist
  db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT,
    role TEXT,
    meta TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS menu (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    stock INTEGER,
    meta TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    staff TEXT,
    timestamp TEXT,
    total REAL,
    payload TEXT,
    serverReceivedAt TEXT
  )`);

  // Insert default data if tables are empty
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row && row.count === 0) {
      const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'staff1', password: 'staff123', role: 'staff' }
      ];
      defaultUsers.forEach(user => {
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
               [user.username, user.password, user.role]);
      });
    }
  });

  db.get("SELECT COUNT(*) as count FROM menu", (err, row) => {
    if (row && row.count === 0) {
      const defaultMenu = [
        { id: 'm-1', name: 'Shawarma Wrap', price: 20, stock: 25 },
        { id: 'm-2', name: 'Chicken Shawarma', price: 25, stock: 20 },
        { id: 'm-3', name: 'Beef Shawarma', price: 28, stock: 18 }
      ];
      defaultMenu.forEach(item => {
        db.run('INSERT INTO menu (id, name, price, stock) VALUES (?, ?, ?, ?)', 
               [item.id, item.name, item.price, item.stock]);
      });
    }
  });
});

// Helper functions for async database operations
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Shawarma Boss MERN Server Running', db: DB_FILE });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Username and password required' });
    }
    
    const user = await getAsync('SELECT username, role FROM users WHERE username = ? AND password = ?', 
                                [username, password]);
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
    const users = await allAsync('SELECT username, role, meta FROM users');
    const mapped = users.map(u => ({
      username: u.username,
      role: u.role,
      meta: u.meta ? JSON.parse(u.meta) : null
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
    
    await runAsync('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                   [username, password, role]);
    res.json({ ok: true, username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get menu
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await allAsync('SELECT id, name, price, stock, meta FROM menu');
    const mapped = menu.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      meta: item.meta ? JSON.parse(item.meta) : null
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
    await runAsync('INSERT INTO menu (id, name, price, stock) VALUES (?, ?, ?, ?)', 
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
    
    await runAsync('UPDATE menu SET stock = ? WHERE id = ?', [parseInt(stock), id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get orders/sales
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await allAsync('SELECT id, staff, timestamp, total, payload, serverReceivedAt FROM orders ORDER BY serverReceivedAt DESC LIMIT 500');
    const mapped = orders.map(o => ({
      id: o.id,
      staff: o.staff,
      timestamp: o.timestamp,
      total: o.total,
      payload: o.payload ? JSON.parse(o.payload) : null,
      serverReceivedAt: o.serverReceivedAt
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
    
    const payload = JSON.stringify(order);
    const serverReceivedAt = new Date().toISOString();
    
    await runAsync('INSERT OR IGNORE INTO orders (id, staff, timestamp, total, payload, serverReceivedAt) VALUES (?, ?, ?, ?, ?, ?)',
                   [order.id, order.user || order.staff || '', order.timestamp || new Date().toISOString(), order.total || 0, payload, serverReceivedAt]);
    
    res.json({ ok: true, id: order.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Shawarma Boss MERN Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔗 API endpoints available at /api/*`);
});