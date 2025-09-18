// server.js - Shawarma Boss sync server (Express + JSON file storage)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
const DB_FILE = process.env.DB_FILE || 'data.json';
const SYNC_TOKEN = process.env.SYNC_TOKEN || ''; // optional

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// require token middleware (if SYNC_TOKEN set)
function requireToken(req, res, next) {
  if (!SYNC_TOKEN) return next();
  const auth = (req.headers['authorization'] || '');
  if (!auth.startsWith('Bearer ') || auth.split(' ')[1] !== SYNC_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized - missing/invalid token' });
  }
  next();
}

// JSON file storage helpers
const dbPath = path.join(__dirname, DB_FILE);

function loadDB() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading database:', e);
  }
  // Default data structure
  return {
    users: [
      { username: 'admin', password: 'admin123', role: 'admin', meta: null },
      { username: 'staff1', password: 'staff123', role: 'staff', meta: null }
    ],
    menu: [
      { id: 'm-1', name: 'Shawarma Wrap', price: 20, stock: 25, meta: null },
      { id: 'm-2', name: 'Chicken Shawarma', price: 25, stock: 20, meta: null },
      { id: 'm-3', name: 'Beef Shawarma', price: 28, stock: 18, meta: null }
    ],
    orders: []
  };
}

function saveDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving database:', e);
    return false;
  }
}

// Initialize database
let db = loadDB();

// ----- Endpoints -----

// Health
app.get('/health', (req,res)=> res.json({ ok:true, db: DB_FILE }));

// LOGIN - simple check against users
app.post('/login', requireToken, (req,res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ ok:false, error:'username+password required' });
    
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ ok:false, error:'invalid credentials' });
    
    res.json({ ok:true, username: user.username, role: user.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:e.message });
  }
});

// STAFF - GET list
app.get('/staff', requireToken, (req,res) => {
  try {
    const mapped = db.users.map(u => ({ username: u.username, role: u.role, meta: u.meta }));
    res.json(mapped);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// STAFF BULK - upsert many
app.post('/staff/bulk', requireToken, (req,res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.users || []);
    const accepted = [];
    
    list.forEach(u => {
      if (!u.username) return;
      
      const existingIndex = db.users.findIndex(existing => existing.username === u.username);
      const userData = {
        username: u.username,
        password: u.password || '',
        role: u.role || 'staff',
        meta: u.meta || null
      };
      
      if (existingIndex >= 0) {
        db.users[existingIndex] = userData;
      } else {
        db.users.push(userData);
      }
      accepted.push(u.username);
    });
    
    saveDB(db);
    res.json({ accepted });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// MENU - GET
app.get('/menu', requireToken, (req,res) => {
  try {
    res.json(db.menu);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// MENU BULK - upsert
app.post('/menu/bulk', requireToken, (req,res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.menu || []);
    const accepted = [];
    
    list.forEach(it => {
      const id = it.id || ('m-'+Date.now()+'-'+Math.floor(Math.random()*1000));
      const existingIndex = db.menu.findIndex(existing => existing.id === id);
      const menuItem = {
        id: id,
        name: it.name || 'item',
        price: it.price || 0,
        stock: it.stock || 0,
        meta: it.meta || null
      };
      
      if (existingIndex >= 0) {
        db.menu[existingIndex] = menuItem;
      } else {
        db.menu.push(menuItem);
      }
      accepted.push(id);
    });
    
    saveDB(db);
    res.json({ accepted });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// ORDERS - GET (recent)
app.get('/orders', requireToken, (req,res) => {
  try {
    const recent = db.orders.sort((a, b) => new Date(b.serverReceivedAt) - new Date(a.serverReceivedAt)).slice(0, 500);
    res.json(recent);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// ORDERS - POST (single)
app.post('/orders', requireToken, (req,res) => {
  try {
    const order = req.body;
    if (!order || !order.id) return res.status(400).json({ error:'order with id required' });
    
    // Check if order already exists
    const exists = db.orders.find(o => o.id === order.id);
    if (!exists) {
      const orderData = {
        id: order.id,
        staff: order.user || order.staff || '',
        timestamp: order.timestamp || new Date().toISOString(),
        total: order.total || 0,
        payload: order,
        serverReceivedAt: new Date().toISOString()
      };
      db.orders.push(orderData);
      saveDB(db);
    }
    res.json({ accepted: [order.id] });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// ORDERS bulk
app.post('/orders/bulk', requireToken, (req,res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.orders || []);
    const accepted = [];
    
    list.forEach(o => {
      if (!o || !o.id) return;
      const exists = db.orders.find(existing => existing.id === o.id);
      if (exists) return; // skip if already exists
      
      const orderData = {
        id: o.id,
        staff: o.user || o.staff || '',
        timestamp: o.timestamp || new Date().toISOString(),
        total: o.total || 0,
        payload: o,
        serverReceivedAt: new Date().toISOString()
      };
      db.orders.push(orderData);
      accepted.push(o.id);
    });
    
    saveDB(db);
    res.json({ accepted, rejected: [] });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// SALES endpoints - alias to orders
app.get('/sales', requireToken, (req,res) => {
  try {
    const sales = db.orders
      .sort((a, b) => new Date(b.serverReceivedAt) - new Date(a.serverReceivedAt))
      .slice(0, 500)
      .map(r => ({ id: r.id, staff: r.staff, timestamp: r.timestamp, total: r.total, payload: r.payload }));
    res.json(sales);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

app.post('/sales/bulk', requireToken, (req,res) => {
  // reuse orders bulk endpoint
  const ordersBulkEndpoint = (req, res) => {
    try {
      const list = Array.isArray(req.body) ? req.body : (req.body.orders || []);
      const accepted = [];
      
      list.forEach(o => {
        if (!o || !o.id) return;
        const exists = db.orders.find(existing => existing.id === o.id);
        if (exists) return;
        
        const orderData = {
          id: o.id,
          staff: o.user || o.staff || '',
          timestamp: o.timestamp || new Date().toISOString(),
          total: o.total || 0,
          payload: o,
          serverReceivedAt: new Date().toISOString()
        };
        db.orders.push(orderData);
        accepted.push(o.id);
      });
      
      saveDB(db);
      res.json({ accepted, rejected: [] });
    } catch(e){ res.status(500).json({ error:e.message }); }
  };
  ordersBulkEndpoint(req, res);
});

// Serve static files in production (when SERVE_STATIC=true)
if (process.env.SERVE_STATIC === 'true') {
  app.use(express.static(path.join(__dirname, '..')));
  
  // Serve index.html for root requests
  app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
} else {
  // Simple root for API-only mode
  app.get('/', (req,res) => res.json({ ok:true, message:'Shawarma Boss sync server' }));
}

// Start server
app.listen(PORT, () => console.log(`Server listening on ${PORT} (DB: ${dbPath})`));
