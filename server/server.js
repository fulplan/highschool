// server.js - Shawarma Boss sync server (Express + SQLite)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 4000;
const DB_FILE = process.env.DB_FILE || 'orders.db';
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

// Ensure DB folder & open
const dbPath = path.join(__dirname, DB_FILE);
const dbExists = fs.existsSync(dbPath);
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // users table (staff/admin)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT,
    role TEXT,
    meta TEXT
  )`);

  // menu items
  db.run(`CREATE TABLE IF NOT EXISTS menu (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    stock INTEGER,
    meta TEXT
  )`);

  // orders (saved as payload JSON + summary fields)
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    staff TEXT,
    timestamp TEXT,
    total REAL,
    payload TEXT,
    serverReceivedAt TEXT
  )`);
});

// Helper promises
function runAsync(sql, params=[]) {
  return new Promise((resolve, reject) => db.run(sql, params, function(err){
    if(err) return reject(err);
    resolve(this);
  }));
}
function allAsync(sql, params=[]) {
  return new Promise((resolve,reject)=> db.all(sql, params, (err,rows)=> err?reject(err):resolve(rows)));
}
function getAsync(sql, params=[]) {
  return new Promise((resolve,reject)=> db.get(sql, params, (err,row)=> err?reject(err):resolve(row)));
}

// ----- Endpoints -----

// Health
app.get('/health', (req,res)=> res.json({ ok:true, db: DB_FILE }));

// LOGIN - simple check against users table
app.post('/login', requireToken, async (req,res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ ok:false, error:'username+password required' });
    const row = await getAsync('SELECT username, role FROM users WHERE username = ? AND password = ?', [username, password]);
    if (!row) return res.status(401).json({ ok:false, error:'invalid credentials' });
    res.json({ ok:true, username: row.username, role: row.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:e.message });
  }
});

// STAFF - GET list
app.get('/staff', requireToken, async (req,res) => {
  try {
    const rows = await allAsync('SELECT username, role, meta FROM users');
    const mapped = rows.map(r => ({ username: r.username, role: r.role, meta: r.meta ? JSON.parse(r.meta) : null }));
    res.json(mapped);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// STAFF BULK - upsert many
app.post('/staff/bulk', requireToken, async (req,res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.users || []);
    const accepted = [];
    await Promise.all(list.map(async u => {
      if (!u.username) return;
      const meta = u.meta ? JSON.stringify(u.meta) : null;
      // upsert
      await runAsync(`INSERT INTO users (username,password,role,meta) VALUES (?,?,?,?)
        ON CONFLICT(username) DO UPDATE SET password=excluded.password, role=excluded.role, meta=excluded.meta`, [u.username, u.password||'', u.role||'staff', meta]);
      accepted.push(u.username);
    }));
    res.json({ accepted });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// MENU - GET
app.get('/menu', requireToken, async (req,res) => {
  try {
    const rows = await allAsync('SELECT id,name,price,stock,meta FROM menu');
    const mapped = rows.map(r => ({ id:r.id, name:r.name, price:r.price, stock:r.stock, meta: r.meta ? JSON.parse(r.meta) : null }));
    res.json(mapped);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// MENU BULK - upsert
app.post('/menu/bulk', requireToken, async (req,res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.menu || []);
    const accepted = [];
    await Promise.all(list.map(async it => {
      const id = it.id || ('m-'+Date.now()+'-'+Math.floor(Math.random()*1000));
      const meta = it.meta ? JSON.stringify(it.meta) : null;
      await runAsync(`INSERT INTO menu (id,name,price,stock,meta) VALUES (?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET name=excluded.name, price=excluded.price, stock=excluded.stock, meta=excluded.meta`, [id, it.name||'item', it.price||0, it.stock||0, meta]);
      accepted.push(id);
    }));
    res.json({ accepted });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// ORDERS - GET (recent)
app.get('/orders', requireToken, async (req,res) => {
  try {
    const rows = await allAsync('SELECT id,staff,timestamp,total,payload,serverReceivedAt FROM orders ORDER BY serverReceivedAt DESC LIMIT 500');
    const mapped = rows.map(r => ({ id:r.id, staff:r.staff, timestamp:r.timestamp, total:r.total, payload: r.payload ? JSON.parse(r.payload) : null, serverReceivedAt: r.serverReceivedAt }));
    res.json(mapped);
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// ORDERS - POST (single)
app.post('/orders', requireToken, async (req,res) => {
  try {
    const order = req.body;
    if (!order || !order.id) return res.status(400).json({ error:'order with id required' });
    const payload = JSON.stringify(order);
    const serverReceivedAt = new Date().toISOString();
    // insert if not exists
    await runAsync('INSERT OR IGNORE INTO orders (id,staff,timestamp,total,payload,serverReceivedAt) VALUES (?,?,?,?,?,?)',
      [order.id, order.user || order.staff || '', order.timestamp || new Date().toISOString(), order.total || 0, payload, serverReceivedAt]);
    res.json({ accepted: [order.id] });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// ORDERS bulk
app.post('/orders/bulk', requireToken, async (req,res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.orders || []);
    const accepted = [];
    await Promise.all(list.map(async o => {
      if (!o || !o.id) return;
      const exists = await getAsync('SELECT id FROM orders WHERE id = ?', [o.id]);
      if (exists) return; // skip
      const payload = JSON.stringify(o);
      const serverReceivedAt = new Date().toISOString();
      await runAsync('INSERT INTO orders (id,staff,timestamp,total,payload,serverReceivedAt) VALUES (?,?,?,?,?,?)',
        [o.id, o.user || o.staff || '', o.timestamp || new Date().toISOString(), o.total || 0, payload, serverReceivedAt]);
      accepted.push(o.id);
    }));
    res.json({ accepted, rejected: [] });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

// SALES endpoints - alias to orders
app.get('/sales', requireToken, async (req,res) => {
  try {
    const rows = await allAsync('SELECT id,staff,timestamp,total,payload FROM orders ORDER BY serverReceivedAt DESC LIMIT 500');
    res.json(rows.map(r => ({ id:r.id, staff:r.staff, timestamp:r.timestamp, total:r.total, payload: r.payload ? JSON.parse(r.payload) : null })));
  } catch(e){ res.status(500).json({ error:e.message }); }
});
app.post('/sales/bulk', requireToken, async (req,res) => {
  // reuse orders bulk for sales
  return app._router.handle({ method:'POST', url:'/orders/bulk', headers:req.headers, body:req.body }, res);
});

// Simple root
app.get('/', (req,res) => res.json({ ok:true, message:'Shawarma Boss sync server' }));

// Start server
app.listen(PORT, () => console.log(`Server listening on ${PORT} (DB: ${dbPath})`));
