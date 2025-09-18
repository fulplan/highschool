import React from 'react';
import { useCart } from '../services/CartContext';

const Cart = ({ onConfirmOrder }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount 
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-danger">Cart ({getCartCount()})</h4>
          <div className="flex gap-2">
            <button
              onClick={clearCart}
              disabled={cartItems.length === 0}
              className="btn btn-outline-danger btn-sm"
            >
              Clear
            </button>
            <button
              onClick={onConfirmOrder}
              disabled={cartItems.length === 0}
              className="btn btn-success btn-sm"
            >
              Confirm Order
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Cart is empty
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted">
                    GHS {parseFloat(item.price || 0).toFixed(2)} each
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="btn btn-outline-danger btn-sm w-8 h-8 flex items-center justify-center p-0"
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    className="form-control w-16 text-center"
                  />
                  
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="btn btn-outline-danger btn-sm w-8 h-8 flex items-center justify-center p-0"
                  >
                    +
                  </button>
                  
                  <div className="text-right min-w-20">
                    <div className="font-bold">
                      GHS {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-lg text-success">
                GHS {getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;