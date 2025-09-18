import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { useCart } from '../services/CartContext';
import { getMenu, createOrder, updateMenuStock } from '../services/api';
import MenuGrid from './MenuGrid';
import Cart from './Cart';
import OrderModal from './OrderModal';

const POS = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadMenu();
    loadRecentOrders();
  }, []);

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      const menuData = await getMenu();
      setMenu(menuData);
      setError('');
    } catch (error) {
      console.error('Error loading menu:', error);
      setError('Failed to load menu. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentOrders = () => {
    const stored = localStorage.getItem('shawarma_boss_recent_orders');
    if (stored) {
      try {
        setRecentOrders(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading recent orders:', error);
      }
    }
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const order = {
      id: 'order-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user: user.username,
      staff: user.username,
      timestamp: new Date().toISOString(),
      items: cartItems,
      total: getCartTotal(),
      status: 'completed'
    };

    try {
      // Save order to backend
      await createOrder(order);

      // Update stock for each item
      for (const item of cartItems) {
        const menuItem = menu.find(m => m.id === item.id);
        if (menuItem && menuItem.stock >= item.quantity) {
          await updateMenuStock(item.id, menuItem.stock - item.quantity);
        }
      }

      // Update local menu state
      setMenu(prevMenu =>
        prevMenu.map(menuItem => {
          const cartItem = cartItems.find(item => item.id === menuItem.id);
          if (cartItem) {
            return {
              ...menuItem,
              stock: Math.max(0, menuItem.stock - cartItem.quantity)
            };
          }
          return menuItem;
        })
      );

      // Save to recent orders
      const newRecentOrders = [order, ...recentOrders.slice(0, 4)];
      setRecentOrders(newRecentOrders);
      localStorage.setItem('shawarma_boss_recent_orders', JSON.stringify(newRecentOrders));

      // Show order modal
      setShowOrderModal(true);

      // Clear cart
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner"></div>
        <span className="ml-2">Loading menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="text-danger mb-4">{error}</div>
          <button 
            onClick={loadMenu}
            className="btn btn-danger"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-layout fade-in">
      {/* Header Section */}
      <div className="pos-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h4 mb-1 text-danger fw-bold">
              <i className="fas fa-cash-register me-2"></i>
              Point of Sale
            </h2>
            <p className="text-muted mb-0">Welcome back, {user.username}</p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={loadMenu}
              className="btn btn-outline-danger btn-sm"
            >
              <i className="fas fa-sync me-1"></i>
              Refresh Menu
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Menu Section - Enhanced Grid Layout */}
        <div className="col-lg-8">
          <div className="card pos-menu-card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="fas fa-utensils me-2"></i>
                Menu Items
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="pos-menu-container p-3">
                <MenuGrid menu={menu} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Cart & Orders */}
        <div className="col-lg-4">
          <div className="pos-sidebar">
            {/* Current Order/Cart */}
            <div className="card mb-4 pos-cart-card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Current Order
                </h5>
              </div>
              <div className="card-body p-0">
                <Cart onConfirmOrder={handleConfirmOrder} />
              </div>
            </div>
            
            {/* Recent Orders - Compact View */}
            <div className="card pos-recent-orders">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Orders
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {recentOrders.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <i className="fas fa-receipt fa-2x text-muted mb-2"></i>
                    <p className="mb-0 text-sm">No recent orders</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border rounded p-2 bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold text-sm">#{order.id.slice(-6)}</div>
                            <div className="text-xs text-muted">
                              {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-success">GHS {parseFloat(order.total || 0).toFixed(2)}</div>
                            <div className="text-xs text-muted">
                              {order.items?.length || 0} items
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {showOrderModal && (
        <OrderModal
          order={recentOrders[0]}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
};

export default POS;