import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Menu from './components/Menu';
import Cart from './components/Cart';
import apiService from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setAuthToken(token);
      try {
        await apiService.health();
        // If health check passes, load initial data
        await loadInitialData();
      } catch (error) {
        console.error('Auth check failed:', error);
        apiService.clearAuthToken();
      }
    }
    setLoading(false);
  };

  const loadInitialData = async () => {
    try {
      const menu = await apiService.getMenu();
      setMenuItems(menu || []);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    await loadInitialData();
  };

  const handleLogout = () => {
    apiService.clearAuthToken();
    setUser(null);
    setCart([]);
    setMenuItems([]);
  };

  const handleAddToCart = (item, quantity) => {
    const existingItem = cart.find(c => c.id === item.id);
    
    if (existingItem) {
      const newQty = existingItem.qty + quantity;
      if (newQty > item.stock) {
        alert(`Cannot add ${quantity} items. Only ${item.stock - existingItem.qty} available.`);
        return;
      }
      setCart(cart.map(c => 
        c.id === item.id 
          ? { ...c, qty: newQty }
          : c
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        qty: quantity,
        menu_item_id: item.id
      }]);
    }
  };

  const handleUpdateCart = (itemId, newQty) => {
    const menuItem = menuItems.find(m => m.id === itemId);
    if (menuItem && newQty > menuItem.stock) {
      alert('Not enough stock available');
      return;
    }
    
    setCart(cart.map(c => 
      c.id === itemId 
        ? { ...c, qty: newQty }
        : c
    ));
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.qty,
          notes: ''
        })),
        customer_name: '',
        customer_phone: '',
        payment_method: 'cash',
        notes: ''
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        alert(`Order ${response.order.order_number} created successfully!`);
        setCart([]);
        // Refresh menu to update stock
        await loadInitialData();
      }
    } catch (error) {
      alert('Failed to create order: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-500">Shawarma Boss</h1>
              <p className="text-sm text-gray-300">MERN Stack POS</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Logged in: <strong>{user.username}</strong> ({user.role})</p>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 mt-1"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Menu</h2>
              {menuItems.length > 0 ? (
                <Menu 
                  menuItems={menuItems}
                  onAddToCart={handleAddToCart}
                  cart={cart}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No menu items available</p>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onUpdateCart={handleUpdateCart}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;