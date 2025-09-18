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
    <div className="fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-danger">Menu</h3>
                <button
                  onClick={loadMenu}
                  className="btn btn-outline-danger btn-sm"
                >
                  Refresh Menu
                </button>
              </div>
              <MenuGrid menu={menu} />
            </div>
          </div>
        </div>

        {/* Cart & Recent Orders Section */}
        <div className="space-y-6">
          <Cart onConfirmOrder={handleConfirmOrder} />
          
          {/* Recent Orders */}
          <div className="card">
            <div className="card-body">
              <h4 className="font-bold text-danger mb-4">Recent Orders</h4>
              {recentOrders.length === 0 ? (
                <p className="text-muted text-sm">No recent orders</p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Order #{order.id.slice(-6)}</span>
                        <span className="text-success font-bold">GHS {order.total.toFixed(2)}</span>
                      </div>
                      <div className="text-muted text-xs mt-1">
                        {new Date(order.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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