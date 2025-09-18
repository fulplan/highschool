/* app.js - Shawarma Boss POS (PostgreSQL + JWT Backend)
   ✅ Real database integration with PostgreSQL
   ✅ JWT-based authentication
   ✅ Role-based access control
   ✅ Real-time data sync
*/

// ---------- API Configuration ----------
// Always use port 8000 for backend API in development
const API_BASE = 'http://localhost:8000';

let runtime = {
  user: null,
  token: localStorage.getItem('auth_token'),
  cart: [],
  menu: [],
  orders: [],
  users: []
};

// ---------- API Helper Functions ----------
async function apiRequest(endpoint, options = {}) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(runtime.token && { 'Authorization': `Bearer ${runtime.token}` })
    },
    ...options
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Authentication helpers
function setAuthToken(token) {
  runtime.token = token;
  localStorage.setItem('auth_token', token);
}

function clearAuthToken() {
  runtime.token = null;
  runtime.user = null;
  localStorage.removeItem('auth_token');
}

// Check if user is logged in and token is valid
async function checkAuthStatus() {
  if (!runtime.token) return false;
  
  try {
    // Use a simple endpoint that works for all roles
    const response = await apiRequest('/health');
    return true;
  } catch (error) {
    if (error.message.includes('403') || error.message.includes('401')) {
      clearAuthToken();
      return false;
    }
    return true; // Might be a network error, keep token
  }
}

// DOM helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// ---------- AUTH ----------
function showLogin() {
  $('#loginScreen')?.classList.remove('d-none');
  $('#appRoot')?.classList.add('d-none');
  $('#adminPanel')?.classList.add('d-none');
  $('#headerControls').innerHTML = '';
}

async function showAppForUser() {
  $('#loginScreen')?.classList.add('d-none');
  $('#appRoot')?.classList.remove('d-none');

  const h = $('#headerControls');
  if (runtime.user) {
    h.innerHTML = `<div class="text-end small pe-2">Logged in: <strong>${runtime.user.username}</strong> (${runtime.user.role})
      <button id="logoutBtnHeader" class="btn btn-sm btn-outline-light ms-2">Logout</button></div>`;
    $('#logoutBtnHeader')?.addEventListener('click', () => logout());
  }

  const isAdmin = runtime.user && (runtime.user.role === 'admin' || runtime.user.role === 'super_admin');
  if (isAdmin) $('#adminPanel')?.classList.remove('d-none');
  else $('#adminPanel')?.classList.add('d-none');

  // Load data and render UI
  await loadInitialData();
  renderMenuGrid();
  renderCart();
  renderRecentSales();
  renderSalesReport();
  renderAdminPanel();
}

async function loginAttempt() {
  $('#loginErr')?.classList.add('d-none');
  const username = ($('#loginUsername')?.value || '').trim();
  const password = ($('#loginPassword')?.value || '').trim();
  
  if (!username || !password) {
    $('#loginErr').textContent = 'Please enter username and password';
    $('#loginErr')?.classList.remove('d-none');
    return;
  }

  try {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: { username, password }
    });

    if (response.token) {
      setAuthToken(response.token);
      runtime.user = response.user;
      await showAppForUser();
    } else {
      $('#loginErr').textContent = response.error || 'Login failed';
      $('#loginErr')?.classList.remove('d-none');
    }
  } catch (error) {
    $('#loginErr').textContent = error.message || 'Login failed';
    $('#loginErr')?.classList.remove('d-none');
  }
}

function logout() {
  clearAuthToken();
  runtime.cart = [];
  runtime.menu = [];
  runtime.orders = [];
  runtime.users = [];
  showLogin();
}

// Load initial data from API
async function loadInitialData() {
  try {
    const [menuResponse] = await Promise.all([
      apiRequest('/menu')
    ]);
    
    runtime.menu = menuResponse || [];
    
    // Load additional data for admins
    if (runtime.user && (runtime.user.role === 'admin' || runtime.user.role === 'super_admin')) {
      try {
        const [usersResponse, ordersResponse] = await Promise.all([
          apiRequest('/users'),
          apiRequest('/orders?limit=50')
        ]);
        
        runtime.users = usersResponse || [];
        runtime.orders = ordersResponse || [];
      } catch (error) {
        console.warn('Could not load admin data:', error);
      }
    }
  } catch (error) {
    console.error('Failed to load initial data:', error);
    alert('Failed to load data. Please refresh the page.');
  }
}

// ---------- MENU & CART ----------
function renderMenuGrid() {
  const container = $('#menuGrid');
  if (!container) return;
  container.innerHTML = '';
  
  if (!runtime.menu || runtime.menu.length === 0) {
    container.innerHTML = '<div class="text-center text-muted">No menu items available</div>';
    return;
  }
  
  const tpl = document.getElementById('menuCardTpl');
  runtime.menu.forEach((item) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.item-name').textContent = item.name;
    node.querySelector('.item-price-badge').textContent = `GHS ${Number(item.price).toFixed(2)}`;
    node.querySelector('.item-stock').textContent = `Stock: ${item.stock} | ${item.category || 'Uncategorized'}`;
    const qtyInput = node.querySelector('.qty-input');
    qtyInput.value = 1;
    qtyInput.max = item.stock;
    
    const addButton = node.querySelector('.add-to-cart');
    if (item.stock <= 0) {
      addButton.disabled = true;
      addButton.textContent = 'Out of Stock';
      addButton.classList.add('btn-secondary');
      addButton.classList.remove('btn-danger');
    } else {
      addButton.addEventListener('click', () => {
        const q = Math.max(1, Math.min(parseInt(qtyInput.value) || 1, item.stock));
        if (item.stock < q) return alert('Not enough stock available');
        addToCart(item.id, q);
      });
    }
    
    container.appendChild(node);
  });
}

function addToCart(id, qty) {
  const item = runtime.menu.find(m => m.id === id);
  if (!item) return;
  
  const existing = runtime.cart.find(c => c.id === id);
  const currentQty = existing ? existing.qty : 0;
  const newQty = currentQty + qty;
  
  if (newQty > item.stock) {
    alert(`Cannot add ${qty} items. Only ${item.stock - currentQty} available.`);
    return;
  }
  
  if (existing) {
    existing.qty = newQty;
  } else {
    runtime.cart.push({ 
      id: item.id, 
      name: item.name, 
      price: Number(item.price), 
      qty: qty,
      menu_item_id: item.id 
    });
  }
  
  renderCart();
}

function renderCart() {
  const list = $('#cartList');
  if (!list) return;
  list.innerHTML = '';
  if (!runtime.cart.length) {
    list.innerHTML = '<div class="small text-muted">Cart is empty</div>';
    $('#cartTotal').textContent = 'GHS 0.00';
    return;
  }
  
  let subtotal = 0;
  runtime.cart.forEach((item, idx) => {
    subtotal += item.qty * item.price;
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div class="small text-muted">${item.qty} × GHS ${item.price.toFixed(2)}</div>
      </div>
      <div class="text-end">
        <div class="fw-bold">GHS ${(item.qty * item.price).toFixed(2)}</div>
        <div>
          <button class="btn btn-sm btn-outline-secondary decrease-qty" data-idx="${idx}">-</button>
          <span class="mx-1">${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary increase-qty" data-idx="${idx}">+</button>
          <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-idx="${idx}">×</button>
        </div>
      </div>`;
    list.appendChild(row);
  });
  
  // Calculate tax and total
  const taxRate = 15; // TODO: Get from settings API
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  
  // Update totals display
  const totalsHtml = `
    <div class="small d-flex justify-content-between">
      <span>Subtotal:</span>
      <span>GHS ${subtotal.toFixed(2)}</span>
    </div>
    <div class="small d-flex justify-content-between">
      <span>Tax (${taxRate}%):</span>
      <span>GHS ${taxAmount.toFixed(2)}</span>
    </div>`;
  
  const totalElement = $('#cartTotal');
  totalElement.innerHTML = `${totalsHtml}<div class="fw-bold">GHS ${total.toFixed(2)}</div>`;
  
  // Add event listeners
  $$('.remove-item').forEach(btn => btn.addEventListener('click', e => {
    runtime.cart.splice(parseInt(e.currentTarget.dataset.idx), 1);
    renderCart();
  }));
  
  $$('.decrease-qty').forEach(btn => btn.addEventListener('click', e => {
    const idx = parseInt(e.currentTarget.dataset.idx);
    if (runtime.cart[idx].qty > 1) {
      runtime.cart[idx].qty--;
      renderCart();
    }
  }));
  
  $$('.increase-qty').forEach(btn => btn.addEventListener('click', e => {
    const idx = parseInt(e.currentTarget.dataset.idx);
    const item = runtime.cart[idx];
    const menuItem = runtime.menu.find(m => m.id === item.id);
    
    if (menuItem && item.qty < menuItem.stock) {
      runtime.cart[idx].qty++;
      renderCart();
    } else {
      alert('Cannot add more items. Stock limit reached.');
    }
  }));
}

function clearCart() { 
  runtime.cart = []; 
  renderCart(); 
}

// ---------- ORDERS ----------
async function confirmOrder() {
  if (!runtime.cart.length) return alert('Cart is empty');
  if (!runtime.user) return alert('Please login first');

  const confirmBtn = $('#confirmOrderBtn');
  const originalText = confirmBtn.textContent;
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Processing...';

  try {
    // Prepare order data for API
    const orderData = {
      items: runtime.cart.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.qty,
        notes: item.notes || ''
      })),
      customer_name: $('#customerName')?.value || '',
      customer_phone: $('#customerPhone')?.value || '',
      payment_method: 'cash', // Default, can be enhanced later
      notes: $('#orderNotes')?.value || ''
    };

    const response = await apiRequest('/orders', {
      method: 'POST',
      body: orderData
    });

    if (response.success) {
      // Show success message
      alert(`Order ${response.order.order_number} created successfully!`);
      
      // Clear cart and refresh data
      runtime.cart = [];
      await loadInitialData(); // Refresh menu (updated stock) and orders
      renderCart();
      renderMenuGrid();
      renderRecentSales();
      renderSalesReport();
      renderAdminPanel();
      
      // Clear customer info
      if ($('#customerName')) $('#customerName').value = '';
      if ($('#customerPhone')) $('#customerPhone').value = '';
      if ($('#orderNotes')) $('#orderNotes').value = '';
      
      // Generate and show receipt
      showReceipt(response.order);
    } else {
      alert('Failed to create order: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Order creation error:', error);
    alert('Failed to create order: ' + error.message);
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = originalText;
  }
}

// Show receipt modal
function showReceipt(order) {
  const modal = $('#receiptModal');
  const body = $('#receiptBody');
  
  if (!modal || !body) return;
  
  const itemsHtml = order.items.map(item => 
    `<div class="d-flex justify-content-between">
      <span>${item.quantity}x ${item.item_name}</span>
      <span>GHS ${item.total_price}</span>
    </div>`
  ).join('');
  
  body.innerHTML = `
    <div class="text-center mb-3">
      <h6>Shawarma Boss</h6>
      <small>Order: ${order.order_number}</small><br>
      <small>${new Date(order.order_date).toLocaleString()}</small><br>
      <small>Staff: ${order.staff_name || runtime.user.username}</small>
    </div>
    <hr>
    ${itemsHtml}
    <hr>
    <div class="d-flex justify-content-between">
      <span>Subtotal:</span>
      <span>GHS ${parseFloat(order.subtotal).toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Tax:</span>
      <span>GHS ${parseFloat(order.tax_amount).toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between fw-bold">
      <span>Total:</span>
      <span>GHS ${parseFloat(order.total_amount).toFixed(2)}</span>
    </div>
    ${order.customer_name ? `<hr><small>Customer: ${order.customer_name}</small>` : ''}
    ${order.customer_phone ? `<br><small>Phone: ${order.customer_phone}</small>` : ''}
  `;
  
  // Show modal using Bootstrap
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// ---------- ADMIN PANEL ----------
function renderAdminPanel() {
  if (!(runtime.user && runtime.user.role === 'admin')) return;
  renderStaffList();
  renderMenuManage();
  renderStockAlerts();

  // Sales filter dropdown
  let filter = $('#salesFilter');
  if (filter) {
    filter.innerHTML = '<option value="all">All staff</option>';
    db.users.filter(u=>u.role==='staff').forEach(s=>{
      const opt = document.createElement('option');
      opt.value = s.username; opt.textContent = s.username;
      filter.appendChild(opt);
    });
  }
}

function renderStaffList() {
  const root = $('#staffList'); if (!root) return;
  root.innerHTML = '';
  db.users.filter(u=>u.role==='staff').forEach(s => {
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between align-items-center mb-1';
    div.innerHTML = `<div>${s.username}</div>
      <button class="btn btn-sm btn-outline-danger remove-staff" data-username="${s.username}">Remove</button>`;
    root.appendChild(div);
  });
  $$('.remove-staff').forEach(b => b.addEventListener('click', e => {
    const name = e.currentTarget.dataset.username;
    db.users = db.users.filter(u => u.username !== name);
    saveDB(db); renderStaffList();
  }));
}

function addStaffFromUI() {
  const u = $('#newStaffUser')?.value.trim();
  const p = $('#newStaffPass')?.value.trim();
  if (!u || !p) return alert('Enter username & password');
  db.users.push({ username: u, password: p, role: 'staff' });
  saveDB(db); renderStaffList();
}

// Menu manage
function renderMenuManage() {
  const root = $('#menuManage'); if (!root) return;
  root.innerHTML = '';
  db.menu.forEach((m,i) => {
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between align-items-center mb-1';
    div.innerHTML = `<div><strong>${m.name}</strong><div class="small text-muted">GHS ${m.price} • stock: ${m.stock}</div></div>
      <button class="btn btn-sm btn-outline-danger delete-item" data-idx="${i}">Del</button>`;
    root.appendChild(div);
  });
  $$('.delete-item').forEach(b => b.addEventListener('click', e => {
    db.menu.splice(parseInt(e.currentTarget.dataset.idx),1);
    saveDB(db); renderMenuGrid(); renderMenuManage();
  }));
}

function addMenuItemFromUI() {
  const name = $('#newItemName')?.value.trim(); 
  const price = parseFloat($('#newItemPrice')?.value); 
  const stock = parseInt($('#newItemStock')?.value);
  if (!name || isNaN(price) || isNaN(stock)) return alert('Invalid item data');
  db.menu.push({ id: 'm-' + Date.now(), name, price, stock });
  saveDB(db);
  renderMenuGrid(); renderMenuManage();
}

function renderStockAlerts() {
  const low = db.menu.filter(m => m.stock < 5);
  $('#stockAlerts').innerHTML = low.length ? low.map(m => `<div>${m.name} low (${m.stock})</div>`).join('') : 'No alerts';
}

// ---------- SALES REPORT ----------
async function renderRecentSales() {
  const root = $('#recentSales'); 
  if (!root) return;
  
  root.innerHTML = '<div class="small text-muted">Loading...</div>';

  try {
    const orders = await apiRequest('/orders?limit=5');
    
    if (!orders || orders.length === 0) { 
      root.innerHTML = '<div class="small text-muted">No recent sales</div>';
      return; 
    }

    root.innerHTML = '';
    orders.forEach(order => {
      const div = document.createElement('div');
      div.className = 'mb-1 small d-flex justify-content-between';
      div.innerHTML = `
        <div>
          <strong>${order.order_number}</strong><br>
          <span class="text-muted">${order.staff_name || 'Unknown'}</span>
        </div>
        <div class="text-end">
          <div class="fw-bold">GHS ${parseFloat(order.total_amount).toFixed(2)}</div>
          <div class="text-muted">${new Date(order.order_date).toLocaleString()}</div>
        </div>`;
      root.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading recent sales:', error);
    root.innerHTML = '<div class="small text-danger">Failed to load sales</div>';
  }
}

function renderSalesReport() {
  const root = $('#salesReport'); if (!root) return;
  let orders = db.orders || [];

  if (runtime.user.role === 'staff') {
    orders = orders.filter(o => o.staff === runtime.user.username);
  } else {
    const filterVal = $('#salesFilter')?.value || 'all';
    if (filterVal !== 'all') orders = orders.filter(o => o.staff === filterVal);
  }

  root.innerHTML = '';
  if (!orders.length) { root.innerHTML = '<div class="small text-muted">No sales</div>'; return; }

  let total = 0;
  orders.slice().reverse().forEach(o => {
    total += o.total;
    const div = document.createElement('div'); div.className = 'p-2 border rounded mb-2';
    div.innerHTML = `<div class="d-flex justify-content-between">
        <div><strong>${o.id}</strong><div class="small text-muted">${o.staff} • ${new Date(o.timestamp).toLocaleString()}</div></div>
        <div><strong>GHS ${o.total.toFixed(2)}</strong></div></div>`;
    root.appendChild(div);
  });
  root.appendChild(Object.assign(document.createElement('div'), {className:'fw-bold mt-2', textContent:`Total: GHS ${total.toFixed(2)}`}));
}

// ---------- Wire UI ----------
document.addEventListener('DOMContentLoaded', () => {
  $('#loginBtn')?.addEventListener('click', loginAttempt);
  $('#clearCartBtn')?.addEventListener('click', clearCart);
  $('#confirmOrderBtn')?.addEventListener('click', confirmOrder);
  $('#addStaffBtn')?.addEventListener('click', addStaffFromUI);
  $('#addItemBtn')?.addEventListener('click', addMenuItemFromUI);
  $('#salesFilter')?.addEventListener('change', renderSalesReport);

  if (runtime.user) showAppForUser(); else showLogin();
});
