/* app.js - Shawarma Boss POS (updated with role-based sales & staff filter)
   ✅ Admin sees all sales OR filter by staff
   ✅ Staff sees only their own sales
   ✅ Menu shared for all users
*/

// ---------- Helpers & storage compatibility ----------
const DB_KEY = 'shawarma_boss_db_v1';
const LEGACY_KEYS = {
  menu: ['shawarma_boss_menu','menu','items'],
  staff: ['shawarma_boss_staff','staff'],
  sales: ['shawarma_boss_sales','sales','shawarma_sales'],
  quick: ['shawarma_boss_quick_sales','quickSales'],
  currentUser: ['shawarma_boss_current_user','loggedIn']
};

function safeParse(key, fallback=null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}

function writeLegacy(keyName, value) {
  const arr = LEGACY_KEYS[keyName] || [];
  arr.forEach(k => {
    try { localStorage.setItem(k, JSON.stringify(value)); } catch(e){ /* ignore */ }
  });
}

function loadDB() {
  const dbFromMain = safeParse(DB_KEY, null);
  if (dbFromMain && typeof dbFromMain === 'object') return dbFromMain;
  return {
    users: safeParse(LEGACY_KEYS.staff[0], null),
    menu: safeParse(LEGACY_KEYS.menu[0], null),
    orders: safeParse(LEGACY_KEYS.sales[0], null),
    quick: safeParse(LEGACY_KEYS.quick[0], null),
    currentUser: safeParse(LEGACY_KEYS.currentUser[0], null)
  };
}

function ensureDefaults(db) {
  if (!Array.isArray(db.users) || db.users.length === 0) {
    db.users = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'staff1', password: 'staff123', role: 'staff' }
    ];
  }
  if (!Array.isArray(db.menu) || db.menu.length === 0) {
    db.menu = [
      { id: 'm-1', name: 'Shawarma Wrap', price: 20, stock: 25 },
      { id: 'm-2', name: 'Chicken Shawarma', price: 25, stock: 20 },
      { id: 'm-3', name: 'Beef Shawarma', price: 28, stock: 18 }
    ];
  }
  if (!Array.isArray(db.orders)) db.orders = [];
  if (!Array.isArray(db.quick)) db.quick = [];
  return db;
}

function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch(e){}
  writeLegacy('menu', db.menu);
  writeLegacy('staff', db.users);
  writeLegacy('sales', db.orders);
  writeLegacy('quick', db.quick);
  if (db.currentUser) writeLegacy('currentUser', db.currentUser);
}

// ---------- Initialize ----------
let db = ensureDefaults(loadDB() || {});
saveDB(db);

let runtime = {
  user: safeParse('shawarma_boss_current_user', null) || db.currentUser || null,
  cart: []
};

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

function showAppForUser() {
  $('#loginScreen')?.classList.add('d-none');
  $('#appRoot')?.classList.remove('d-none');

  const h = $('#headerControls');
  if (runtime.user) {
    h.innerHTML = `<div class="text-end small pe-2">Logged in: <strong>${runtime.user.username}</strong> 
      <button id="logoutBtnHeader" class="btn btn-sm btn-outline-light ms-2">Logout</button></div>`;
    $('#logoutBtnHeader')?.addEventListener('click', () => logout());
  }

  const isAdmin = runtime.user && runtime.user.role === 'admin';
  if (isAdmin) $('#adminPanel')?.classList.remove('d-none');
  else $('#adminPanel')?.classList.add('d-none');

  renderMenuGrid();
  renderCart();
  renderRecentSales();
  renderSalesReport();
  renderAdminPanel();
}

function loginAttempt() {
  $('#loginErr')?.classList.add('d-none');
  const u = ($('#loginUsername')?.value || '').trim();
  const p = ($('#loginPassword')?.value || '').trim();
  const found = db.users.find(x => x.username === u && x.password === p);
  if (!found) return $('#loginErr')?.classList.remove('d-none');
  runtime.user = found;
  db.currentUser = found;
  saveDB(db);
  showAppForUser();
}

function logout() {
  runtime.user = null;
  db.currentUser = null;
  try { localStorage.removeItem('shawarma_boss_current_user'); } catch(e){}
  saveDB(db);
  showLogin();
}

// ---------- MENU & CART ----------
function renderMenuGrid() {
  const container = $('#menuGrid');
  if (!container) return;
  container.innerHTML = '';
  const tpl = document.getElementById('menuCardTpl');
  db.menu.forEach((item, idx) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.item-name').textContent = item.name;
    node.querySelector('.item-price-badge').textContent = `GHS ${Number(item.price).toFixed(2)}`;
    node.querySelector('.item-stock').textContent = `Stock: ${item.stock}`;
    const qtyInput = node.querySelector('.qty-input');
    qtyInput.value = 1;
    node.querySelector('.add-to-cart').addEventListener('click', () => {
      const q = Math.max(1, parseInt(qtyInput.value) || 1);
      if (item.stock < q) return alert('Not enough stock');
      addToCart(item.id || ('id-' + idx), q);
    });
    container.appendChild(node);
  });
}

function addToCart(id, qty) {
  const item = db.menu.find(m => m.id === id);
  if (!item) return;
  const existing = runtime.cart.find(c => c.id === id);
  if (existing) existing.qty += qty;
  else runtime.cart.push({ id: id, name: item.name, price: Number(item.price), qty });
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
  let total = 0;
  runtime.cart.forEach((it, idx) => {
    total += it.qty * it.price;
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';
    row.innerHTML = `<div><strong>${it.name}</strong><div class="small text-muted">${it.qty} × GHS ${it.price.toFixed(2)}</div></div>
      <div class="text-end"><div class="fw-bold">GHS ${(it.qty*it.price).toFixed(2)}</div>
        <button class="btn btn-sm btn-outline-danger remove-item" data-idx="${idx}">Del</button></div>`;
    list.appendChild(row);
  });
  $('#cartTotal').textContent = `GHS ${total.toFixed(2)}`;
  $$('.remove-item').forEach(b => b.addEventListener('click', e => {
    runtime.cart.splice(parseInt(e.currentTarget.dataset.idx),1);
    renderCart();
  }));
}

function clearCart() { runtime.cart = []; renderCart(); }

// ---------- ORDERS ----------
function confirmOrder() {
  if (!runtime.cart.length) return alert('Cart empty');
  if (!runtime.user) return alert('Please login');

  const order = {
    id: 'O' + Date.now(),
    staff: runtime.user.username,
    items: JSON.parse(JSON.stringify(runtime.cart)),
    total: runtime.cart.reduce((s,i)=>s + i.qty*i.price, 0),
    timestamp: new Date().toISOString()
  };

  order.items.forEach(it => {
    const m = db.menu.find(x => x.id === it.id);
    if (m) m.stock = Math.max(0, m.stock - it.qty);
  });

  db.orders.push(order);
  db.quick.push(order);
  saveDB(db);

  runtime.cart = [];
  renderCart();
  renderMenuGrid();
  renderRecentSales();
  renderSalesReport();
  renderAdminPanel();
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
function renderRecentSales() {
  const root = $('#recentSales'); if (!root) return;
  root.innerHTML = '';

  let orders = db.orders || [];
  if (runtime.user.role === 'staff') {
    orders = orders.filter(o => o.staff === runtime.user.username);
  }

  const last = orders.slice(-5).reverse();
  if (!last.length) { root.textContent = 'No sales yet.'; return; }

  last.forEach(o => {
    const div = document.createElement('div'); div.className = 'mb-1 small';
    div.innerHTML = `${o.id} • ${o.staff} • GHS ${o.total.toFixed(2)} • ${new Date(o.timestamp).toLocaleString()}`;
    root.appendChild(div);
  });
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
