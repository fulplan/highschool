import React from 'react';

const Cart = ({ cart, onUpdateCart, onRemoveFromCart, onClearCart, onConfirmOrder }) => {
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const taxRate = 15; // 15% tax rate
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total, taxRate };
  };

  const { subtotal, taxAmount, total, taxRate } = calculateTotals();

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty <= 0) {
      onRemoveFromCart(itemId);
    } else {
      onUpdateCart(itemId, newQty);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Cart</h3>
        <p className="text-gray-500 text-center py-8">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-red-600">Cart</h3>
        <button
          onClick={onClearCart}
          className="text-sm text-gray-500 hover:text-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">
                {item.qty} × GHS {item.price.toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-sm"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.qty}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-sm"
                >
                  +
                </button>
              </div>
              
              <div className="text-right ml-2">
                <div className="font-semibold">
                  GHS {(item.qty * item.price).toFixed(2)}
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>GHS {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax ({taxRate}%):</span>
          <span>GHS {taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>GHS {total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onConfirmOrder}
        className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default Cart;