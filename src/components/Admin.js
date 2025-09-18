import React, { useState, useEffect } from 'react';
import { getStaff, addStaff, getMenu, addMenuItem, updateMenuStock, getOrders } from '../services/api';
import { useAuth } from '../services/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [newStaff, setNewStaff] = useState({ username: '', password: '', role: 'staff' });
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', stock: '' });
  const [stockUpdates, setStockUpdates] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [staffData, menuData, ordersData] = await Promise.all([
        getStaff(),
        getMenu(),
        getOrders()
      ]);
      setStaff(staffData);
      setMenu(menuData);
      setOrders(ordersData);
      setError('');
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.username || !newStaff.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await addStaff(newStaff);
      await loadAllData();
      setNewStaff({ username: '', password: '', role: 'staff' });
      alert('Staff member added successfully!');
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Failed to add staff member');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.stock) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await addMenuItem({
        name: newMenuItem.name,
        price: parseFloat(newMenuItem.price),
        stock: parseInt(newMenuItem.stock)
      });
      await loadAllData();
      setNewMenuItem({ name: '', price: '', stock: '' });
      setSuccessMessage('Menu item added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding menu item:', error);
      setError('Failed to add menu item');
    }
  };

  const handleUpdateStock = async (itemId, newStock) => {
    try {
      await updateMenuStock(itemId, parseInt(newStock));
      await loadAllData();
      setStockUpdates({});
      setSuccessMessage('Stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock');
    }
  };

  const handleStockChange = (itemId, value) => {
    setStockUpdates(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const exportData = () => {
    const data = {
      staff,
      menu,
      orders,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shawarma-boss-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvContent = [
      ['Order ID', 'Staff', 'Date', 'Total', 'Items'].join(','),
      ...orders.map(order => [
        order.id,
        order.staff,
        order.timestamp,
        order.total,
        order.payload ? order.payload.items?.map(item => `${item.name} x${item.quantity}`).join(';') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate sales stats
  const salesStats = React.useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    );
    const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const todaySales = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    const staffSales = {};
    orders.forEach(order => {
      if (!staffSales[order.staff]) {
        staffSales[order.staff] = { orders: 0, total: 0 };
      }
      staffSales[order.staff].orders++;
      staffSales[order.staff].total += Number(order.total || 0);
    });

    return {
      totalOrders: orders.length,
      totalSales,
      todayOrders: todayOrders.length,
      todaySales,
      staffSales
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner"></div>
        <span className="ml-2">Loading admin panel...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="text-danger mb-4">{error}</div>
          <button onClick={loadAllData} className="btn btn-danger">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-check-circle me-2"></i>{successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h4 fw-bold text-danger mb-0">
            <i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-info bg-opacity-10 rounded">
              <div className="text-2xl font-bold text-info">{salesStats.totalOrders}</div>
              <div className="text-sm text-muted">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-success bg-opacity-10 rounded">
              <div className="text-2xl font-bold text-success">GHS {salesStats.totalSales.toFixed(2)}</div>
              <div className="text-sm text-muted">Total Sales</div>
            </div>
            <div className="text-center p-4 bg-warning bg-opacity-10 rounded">
              <div className="text-2xl font-bold text-warning">{salesStats.todayOrders}</div>
              <div className="text-sm text-muted">Today's Orders</div>
            </div>
            <div className="text-center p-4 bg-danger bg-opacity-10 rounded">
              <div className="text-2xl font-bold text-danger">GHS {salesStats.todaySales.toFixed(2)}</div>
              <div className="text-sm text-muted">Today's Sales</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Staff Management */}
        <div className="col-lg-4">
          <div className="card h-100">
          <div className="card-header">
            <h4 className="font-bold text-danger">Staff Management</h4>
          </div>
          <div className="card-body">
            <div className="space-y-2 mb-4">
              {staff.map((member) => (
                <div key={member.username} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{member.username}</div>
                    <div className="text-sm text-muted">{member.role}</div>
                  </div>
                  {salesStats.staffSales[member.username] && (
                    <div className="text-right text-sm">
                      <div>{salesStats.staffSales[member.username].orders} orders</div>
                      <div className="text-success">GHS {salesStats.staffSales[member.username].total.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddStaff} className="space-y-2">
              <input
                type="text"
                placeholder="Username"
                value={newStaff.username}
                onChange={(e) => setNewStaff({...newStaff, username: e.target.value})}
                className="form-control"
              />
              <input
                type="password"
                placeholder="Password"
                value={newStaff.password}
                onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                className="form-control"
              />
              <select
                value={newStaff.role}
                onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                className="form-control"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="btn btn-danger w-full">
                Add Staff
              </button>
            </form>
          </div>
        </div>

        </div>
        </div>

        {/* Menu Management */}
        <div className="col-lg-4">
          <div className="card h-100">
          <div className="card-header">
            <h4 className="font-bold text-danger">Menu Management</h4>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {menu.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center p-2 bg-light rounded border">
                  <div className="flex-grow-1">
                    <div className="fw-medium">{item.name}</div>
                    <div className="text-sm text-muted">GHS {parseFloat(item.price || 0).toFixed(2)}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={stockUpdates[item.id] !== undefined ? stockUpdates[item.id] : item.stock}
                      onChange={(e) => handleStockChange(item.id, e.target.value)}
                      className="form-control form-control-sm"
                      style={{ width: '70px' }}
                    />
                    {stockUpdates[item.id] !== undefined && stockUpdates[item.id] != item.stock && (
                      <button
                        onClick={() => handleUpdateStock(item.id, stockUpdates[item.id])}
                        className="btn btn-sm btn-primary"
                      >
                        Update
                      </button>
                    )}
                    <span className={`badge ${item.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                      {item.stock <= 0 ? 'Out' : item.stock <= 5 ? 'Low' : 'OK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-2">
              <input
                type="text"
                placeholder="Item name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                className="form-control"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                className="form-control"
              />
              <input
                type="number"
                placeholder="Stock"
                value={newMenuItem.stock}
                onChange={(e) => setNewMenuItem({...newMenuItem, stock: e.target.value})}
                className="form-control"
              />
              <button type="submit" className="btn btn-danger w-full">
                Add Item
              </button>
            </form>
          </div>
        </div>
        </div>

        {/* Export & Reports */}
        <div className="col-lg-4">
          <div className="card h-100">
          <div className="card-header">
            <h4 className="font-bold text-danger">Export & Reports</h4>
          </div>
          <div className="card-body">
            <div className="space-y-2 mb-4">
              <button onClick={exportData} className="btn btn-outline-danger w-full">
                Export JSON Data
              </button>
              <button onClick={exportCSV} className="btn btn-outline-danger w-full">
                Export Orders CSV
              </button>
              <button onClick={loadAllData} className="btn btn-outline-danger w-full">
                Refresh Data
              </button>
            </div>

            {/* Stock Alerts */}
            <div>
              <h5 className="font-bold mb-2 text-sm">Stock Alerts</h5>
              <div className="space-y-1">
                {menu
                  .filter(item => item.stock <= 5)
                  .map(item => (
                    <div key={item.id} className="text-sm text-danger">
                      {item.name}: {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                    </div>
                  ))
                }
                {menu.filter(item => item.stock <= 5).length === 0 && (
                  <div className="text-sm text-success">All items well stocked</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div className="card-header">
          <h4 className="font-bold text-danger">Recent Orders</h4>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Staff</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-left p-2">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2 font-mono">#{order.id.slice(-8)}</td>
                    <td className="p-2">{order.staff}</td>
                    <td className="p-2">{new Date(order.timestamp).toLocaleDateString()}</td>
                    <td className="p-2 text-right font-bold">GHS {parseFloat(order.total || 0).toFixed(2)}</td>
                    <td className="p-2 text-xs">
                      {order.payload?.items?.slice(0, 2).map(item => item.name).join(', ')}
                      {order.payload?.items?.length > 2 && '...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-4 text-muted">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;