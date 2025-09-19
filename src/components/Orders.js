import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { getOrders } from '../services/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('today'); // today, week, all
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const orderData = await getOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Filter by date
    if (filter === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter(order => {
        const orderDate = order.timestamp || order.created_at || order.serverReceivedAt;
        return orderDate && new Date(orderDate).toDateString() === today;
      });
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(order => {
        const orderDate = order.timestamp || order.created_at || order.serverReceivedAt;
        return orderDate && new Date(orderDate) >= weekAgo;
      });
    }

    // Filter by search term - safely handle ID types
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const idStr = String(order.id || '');
        const staffStr = String(order.staff || '');
        return idStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
               staffStr.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.created_at || a.serverReceivedAt || 0);
      const dateB = new Date(b.timestamp || b.created_at || b.serverReceivedAt || 0);
      // Handle invalid dates
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      return dateB - dateA; // Most recent first
    });
  };

  const getTotalSales = (orderList) => {
    return orderList.reduce((sum, order) => {
      const total = parseFloat(order.total || order.amount || 0);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);
  };

  const filteredOrders = getFilteredOrders();
  const totalSales = getTotalSales(filteredOrders);

  return (
    <div className="orders-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-1">
            <i className="fas fa-receipt me-2"></i>
            Order History
          </h2>
          <p className="text-muted mb-0">
            {user.role === 'admin' ? 'Manage and view all orders' : 'View recent orders and activity'}
          </p>
        </div>
        
        {/* Today's Quick Stats for Staff */}
        {user.role === 'staff' && (
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-2 px-3">
              <div className="text-muted small">Today's Activity</div>
              <div className="h5 mb-0 text-success">${getTotalSales(orders.filter(order => {
                const today = new Date().toDateString();
                const orderDate = order.timestamp || order.created_at || order.serverReceivedAt;
                return orderDate && new Date(orderDate).toDateString() === today;
              })).toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="btn-group" role="group" aria-label="Order filters">
            <button
              type="button"
              className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('today')}
            >
              <i className="fas fa-calendar-day me-1"></i>Today
            </button>
            <button
              type="button"
              className={`btn ${filter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('week')}
            >
              <i className="fas fa-calendar-week me-1"></i>This Week
            </button>
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              <i className="fas fa-calendar me-1"></i>All Time
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search orders or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-list-alt fa-2x mb-2"></i>
              <div className="h4 mb-0">{filteredOrders.length}</div>
              <div className="small">Orders</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-dollar-sign fa-2x mb-2"></i>
              <div className="h4 mb-0">${totalSales.toFixed(2)}</div>
              <div className="small">Total Sales</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-chart-line fa-2x mb-2"></i>
              <div className="h4 mb-0">
                ${filteredOrders.length > 0 ? (totalSales / filteredOrders.length).toFixed(2) : '0.00'}
              </div>
              <div className="small">Avg. Order</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <div className="h4 mb-0">
                {new Set(filteredOrders.map(o => o.staff).filter(Boolean)).size}
              </div>
              <div className="small">Staff Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-5">
          <i className="fas fa-spinner fa-spin fa-2x text-muted mb-3"></i>
          <p className="text-muted">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No orders found</h5>
          <p className="text-muted">
            {filter === 'today' ? 'No orders today yet' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Orders ({filteredOrders.length})
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Date & Time</th>
                    <th>Staff</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <code className="text-primary">#{String(order.id || 'unknown').slice(-8)}</code>
                      </td>
                      <td>
                        <div className="text-muted small">
                          {new Date(order.timestamp || order.created_at || order.serverReceivedAt).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        {order.staff ? (
                          <div className="d-flex align-items-center">
                            <i className="fas fa-user-circle me-1 text-muted"></i>
                            {order.staff}
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {order.payload?.items?.length || order.items?.length || 'N/A'} items
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          ${parseFloat(order.total || order.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          <i className="fas fa-check me-1"></i>Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;