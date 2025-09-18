// server.js - Shawarma Boss sync server (Express + PostgreSQL)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8000;
const SYNC_TOKEN = process.env.SYNC_TOKEN || ''; // optional
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('🚨 ERROR: JWT_SECRET environment variable is required for security!');
  console.error('Please set JWT_SECRET to a secure random string.');
  process.exit(1);
}

const app = express();
// Configure CORS for React frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Role-based access control middleware
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Legacy token middleware (if SYNC_TOKEN set)
function requireToken(req, res, next) {
  if (!SYNC_TOKEN) return next();
  const auth = (req.headers['authorization'] || '');
  if (!auth.startsWith('Bearer ') || auth.split(' ')[1] !== SYNC_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized - missing/invalid token' });
  }
  next();
}

// Database helper functions
async function createDefaultAdmin() {
  try {
    const existingAdmin = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, password, role, full_name, is_active) VALUES ($1, $2, $3, $4, $5)',
        ['admin', hashedPassword, 'super_admin', 'System Administrator', true]
      );
      console.log('✅ Default admin created - please change password on first login');
    }
    
    // Also create a sample staff member
    const existingStaff = await pool.query('SELECT * FROM users WHERE username = $1', ['staff1']);
    if (existingStaff.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('staff123', 10);
      await pool.query(
        'INSERT INTO users (username, password, role, full_name, is_active) VALUES ($1, $2, $3, $4, $5)',
        ['staff1', hashedPassword, 'staff', 'Sample Staff Member', true]
      );
      console.log('✅ Default staff created - please change password on first login');
    }
  } catch (error) {
    console.error('Error creating default users:', error);
  }
}

// Initialize database connection and default data
async function initializeDatabase() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully');
    await createDefaultAdmin();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

initializeDatabase();

// ----- Endpoints -----

// Health endpoint
app.get('/health', (req, res) => res.json({ ok: true, database: 'PostgreSQL' }));

// LOGIN with JWT authentication
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Username and password required' });
    }
    
    // Find user in database
    const result = await pool.query(
      'SELECT id, username, password, role, full_name, is_active FROM users WHERE username = $1 AND is_active = TRUE',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }
    
    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

// USER MANAGEMENT ENDPOINTS

// Get all users (Admin/Super Admin only)
app.get('/users', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, full_name, email, phone, is_active, created_at, last_login FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get staff only (legacy endpoint for compatibility)
app.get('/staff', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, full_name, email, phone, is_active, created_at, last_login FROM users WHERE role IN (\'staff\', \'cashier\', \'manager\') ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user (Admin/Super Admin only)
app.post('/users', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { username, password, role, full_name, email, phone } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Check if username already exists
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Only super_admin can create admin users
    if (role === 'admin' || role === 'super_admin') {
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Only super admin can create admin users' });
      }
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role, full_name, email, phone, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, role, full_name',
      [username, hashedPassword, role || 'staff', full_name, email, phone, req.user.id]
    );
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (Admin/Super Admin only)
app.put('/users/:id', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, full_name, email, phone, is_active } = req.body;
    
    // Only super_admin can modify admin users
    const targetUser = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if ((targetUser.rows[0].role === 'admin' || targetUser.rows[0].role === 'super_admin') && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only super admin can modify admin users' });
    }
    
    const result = await pool.query(
      'UPDATE users SET username = $1, role = $2, full_name = $3, email = $4, phone = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, username, role, full_name',
      [username, role, full_name, email, phone, is_active, id]
    );
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset user password (Admin/Super Admin only)
app.put('/users/:id/password', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, id]);
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (Super Admin only)
app.delete('/users/:id', authenticateToken, requireRole('super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await pool.query('UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MENU MANAGEMENT ENDPOINTS

// Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE is_active = TRUE ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single menu item
app.get('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM menu_items WHERE id = $1 AND is_active = TRUE', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create menu item (Admin only)
app.post('/menu', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, description, price, cost, stock, category, low_stock_alert } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, cost, stock, category, low_stock_alert, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, cost || 0, stock || 0, category, low_stock_alert || 5, req.user.id]
    );
    
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item (Admin only)
app.put('/menu/:id', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, cost, stock, category, low_stock_alert, is_active } = req.body;
    
    const result = await pool.query(
      'UPDATE menu_items SET name = $1, description = $2, price = $3, cost = $4, stock = $5, category = $6, low_stock_alert = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, description, price, cost, stock, category, low_stock_alert, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item (Admin only)
app.delete('/menu/:id', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('UPDATE menu_items SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get low stock items (Admin only)
app.get('/menu/alerts/low-stock', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE stock <= low_stock_alert AND is_active = TRUE ORDER BY stock ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update menu items (Admin only)
app.post('/menu/bulk', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : (req.body.items || []);
    const accepted = [];
    const errors = [];
    
    for (const item of items) {
      try {
        if (!item.name || !item.price) {
          errors.push({ item: item.name || 'unknown', error: 'Name and price required' });
          continue;
        }
        
        if (item.id) {
          // Update existing
          await pool.query(
            'UPDATE menu_items SET name = $1, price = $2, stock = $3, category = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
            [item.name, item.price, item.stock || 0, item.category, item.id]
          );
        } else {
          // Create new
          const result = await pool.query(
            'INSERT INTO menu_items (name, price, stock, category, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [item.name, item.price, item.stock || 0, item.category, req.user.id]
          );
          item.id = result.rows[0].id;
        }
        accepted.push(item.id);
      } catch (error) {
        errors.push({ item: item.name || 'unknown', error: error.message });
      }
    }
    
    res.json({ accepted, errors });
  } catch (error) {
    console.error('Bulk menu update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ORDER MANAGEMENT ENDPOINTS

// Get orders (role-based access)
app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0, staff_id, start_date, end_date } = req.query;
    
    let query = 'SELECT o.*, u.username as staff_name FROM orders o LEFT JOIN users u ON o.staff_id = u.id WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Role-based filtering
    if (req.user.role === 'staff') {
      query += ` AND o.staff_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    } else if (staff_id) {
      query += ` AND o.staff_id = $${paramIndex}`;
      params.push(staff_id);
      paramIndex++;
    }
    
    // Date filtering
    if (start_date) {
      query += ` AND o.order_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND o.order_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ` ORDER BY o.order_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order with items
app.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order details
    const orderResult = await pool.query(
      'SELECT o.*, u.username as staff_name FROM orders o LEFT JOIN users u ON o.staff_id = u.id WHERE o.id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    // Role-based access control
    if (req.user.role === 'staff' && order.staff_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get order items
    const itemsResult = await pool.query(
      'SELECT oi.*, mi.name as item_name FROM order_items oi LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id WHERE oi.order_id = $1',
      [id]
    );
    
    order.items = itemsResult.rows;
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
app.post('/orders', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, customer_name, customer_phone, payment_method, notes } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }
    
    await client.query('BEGIN');
    
    // Calculate totals with row-level locking to prevent oversells
    let subtotal = 0;
    for (const item of items) {
      const menuItem = await client.query('SELECT price, stock FROM menu_items WHERE id = $1 FOR UPDATE', [item.menu_item_id]);
      if (menuItem.rows.length === 0) {
        throw new Error(`Menu item ${item.menu_item_id} not found`);
      }
      
      if (menuItem.rows[0].stock < item.quantity) {
        throw new Error(`Insufficient stock for item ${item.menu_item_id} - only ${menuItem.rows[0].stock} available`);
      }
      
      subtotal += menuItem.rows[0].price * item.quantity;
    }
    
    // Get tax rate from settings
    const taxResult = await client.query('SELECT setting_value FROM business_settings WHERE setting_key = $1', ['tax_rate']);
    const taxRate = parseFloat(taxResult.rows[0]?.setting_value || '0');
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now();
    
    // Create order with explicit status
    const orderResult = await client.query(
      'INSERT INTO orders (order_number, staff_id, customer_name, customer_phone, subtotal, tax_amount, total_amount, payment_method, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [orderNumber, req.user.id, customer_name, customer_phone, subtotal, taxAmount, totalAmount, payment_method, 'completed', notes]
    );
    
    const order = orderResult.rows[0];
    
    // Create order items and update stock
    for (const item of items) {
      // Add order item
      const menuItemResult = await client.query('SELECT price FROM menu_items WHERE id = $1', [item.menu_item_id]);
      const unitPrice = menuItemResult.rows[0].price;
      const totalPrice = unitPrice * item.quantity;
      
      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, notes) VALUES ($1, $2, $3, $4, $5, $6)',
        [order.id, item.menu_item_id, item.quantity, unitPrice, totalPrice, item.notes]
      );
      
      // Update stock
      await client.query(
        'UPDATE menu_items SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.menu_item_id]
      );
    }
    
    await client.query('COMMIT');
    
    // Get complete order with items for response
    const completeOrder = await pool.query(
      'SELECT o.*, u.username as staff_name FROM orders o LEFT JOIN users u ON o.staff_id = u.id WHERE o.id = $1',
      [order.id]
    );
    
    const orderItems = await pool.query(
      'SELECT oi.*, mi.name as item_name FROM order_items oi LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id WHERE oi.order_id = $1',
      [order.id]
    );
    
    const response = completeOrder.rows[0];
    response.items = orderItems.rows;
    
    res.json({ success: true, order: response });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Update order status (Admin/Staff who created it)
app.put('/orders/:id/status', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status, refund_reason } = req.body;
    
    if (!['pending', 'completed', 'cancelled', 'refunded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await client.query('BEGIN');
    
    // Get order details
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    // Role-based access control
    if (req.user.role === 'staff' && order.staff_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Handle stock adjustments for cancellations/refunds
    if ((status === 'cancelled' || status === 'refunded') && order.status === 'completed') {
      // Restore stock for cancelled/refunded orders
      const orderItems = await client.query(
        'SELECT menu_item_id, quantity FROM order_items WHERE order_id = $1',
        [id]
      );
      
      for (const item of orderItems.rows) {
        await client.query(
          'UPDATE menu_items SET stock = stock + $1 WHERE id = $2',
          [item.quantity, item.menu_item_id]
        );
      }
    }
    
    // Update order status
    await client.query(
      'UPDATE orders SET status = $1, notes = COALESCE(notes, $2) || $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [status, '', refund_reason ? `\nStatus changed to ${status}: ${refund_reason}` : `\nStatus changed to ${status}`, id]
    );
    
    await client.query('COMMIT');
    
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Delete/Cancel order (Admin only)
app.delete('/orders/:id', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // Get order details
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    // Restore stock if order was completed
    if (order.status === 'completed') {
      const orderItems = await client.query(
        'SELECT menu_item_id, quantity FROM order_items WHERE order_id = $1',
        [id]
      );
      
      for (const item of orderItems.rows) {
        await client.query(
          'UPDATE menu_items SET stock = stock + $1 WHERE id = $2',
          [item.quantity, item.menu_item_id]
        );
      }
    }
    
    // Soft delete the order
    await client.query(
      'UPDATE orders SET status = $1, notes = COALESCE(notes, $2) || $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      ['cancelled', '', '\nOrder cancelled by admin', id]
    );
    
    await client.query('COMMIT');
    
    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// BUSINESS SETTINGS ENDPOINTS

// Get all business settings
app.get('/settings', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM business_settings ORDER BY setting_key');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value,
        type: row.setting_type,
        description: row.description
      };
    });
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update business setting
app.put('/settings/:key', authenticateToken, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    await pool.query(
      'UPDATE business_settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP, updated_by = $2 WHERE setting_key = $3',
      [value, req.user.id, key]
    );
    
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SALES REPORTING ENDPOINTS

// Get sales statistics
app.get('/sales/stats', authenticateToken, async (req, res) => {
  try {
    const { period = 'today', staff_id } = req.query;
    
    let dateFilter = '';
    let params = [];
    let paramIndex = 1;
    
    // Role-based filtering
    if (req.user.role === 'staff') {
      dateFilter += ` AND o.staff_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    } else if (staff_id) {
      dateFilter += ` AND o.staff_id = $${paramIndex}`;
      params.push(staff_id);
      paramIndex++;
    }
    
    // Period filtering
    switch (period) {
      case 'today':
        dateFilter += ` AND DATE(o.order_date) = CURRENT_DATE`;
        break;
      case 'week':
        dateFilter += ` AND o.order_date >= DATE_TRUNC('week', CURRENT_DATE)`;
        break;
      case 'month':
        dateFilter += ` AND o.order_date >= DATE_TRUNC('month', CURRENT_DATE)`;
        break;
    }
    
    const queries = {
      totalSales: `SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total FROM orders o WHERE status = 'completed' ${dateFilter}`,
      topItems: `SELECT mi.name, SUM(oi.quantity) as quantity_sold, SUM(oi.total_price) as revenue 
                 FROM order_items oi 
                 JOIN menu_items mi ON oi.menu_item_id = mi.id 
                 JOIN orders o ON oi.order_id = o.id 
                 WHERE o.status = 'completed' ${dateFilter} 
                 GROUP BY mi.id, mi.name 
                 ORDER BY quantity_sold DESC LIMIT 5`,
      staffPerformance: `SELECT u.username, u.full_name, COUNT(o.id) as orders_count, COALESCE(SUM(o.total_amount), 0) as revenue 
                         FROM users u 
                         LEFT JOIN orders o ON u.id = o.staff_id AND o.status = 'completed' ${dateFilter.replace('o.staff_id', 'u.id')} 
                         WHERE u.role IN ('staff', 'cashier', 'manager') 
                         GROUP BY u.id, u.username, u.full_name 
                         ORDER BY revenue DESC`
    };
    
    const [totalSales, topItems, staffPerformance] = await Promise.all([
      pool.query(queries.totalSales, params),
      pool.query(queries.topItems, params),
      pool.query(queries.staffPerformance, params)
    ]);
    
    res.json({
      period,
      totalSales: totalSales.rows[0],
      topItems: topItems.rows,
      staffPerformance: staffPerformance.rows
    });
  } catch (error) {
    console.error('Get sales stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales by date range
app.get('/sales', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date, staff_id, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT o.*, u.username as staff_name FROM orders o LEFT JOIN users u ON o.staff_id = u.id WHERE o.status = \'completed\'';
    const params = [];
    let paramIndex = 1;
    
    // Role-based filtering
    if (req.user.role === 'staff') {
      query += ` AND o.staff_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    } else if (staff_id) {
      query += ` AND o.staff_id = $${paramIndex}`;
      params.push(staff_id);
      paramIndex++;
    }
    
    // Date filtering
    if (start_date) {
      query += ` AND o.order_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND o.order_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ` ORDER BY o.order_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  app.get('/', (req,res) => res.json({ ok:true, message:'Shawarma Boss POS API - PostgreSQL Backend', version: '2.0' }));
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Shawarma Boss POS Server started on port ${PORT}`);
  console.log(`📊 Database: PostgreSQL`);
  console.log(`🔐 Authentication: JWT`);
  console.log(`🌐 CORS enabled`);
});
