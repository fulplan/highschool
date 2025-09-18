import React from 'react';

const Menu = ({ menuItems, onAddToCart, cart }) => {
  const handleAddToCart = (item, quantity = 1) => {
    if (item.stock < quantity) {
      alert('Not enough stock available');
      return;
    }
    onAddToCart(item, quantity);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {menuItems.map((item) => {
        const cartItem = cart.find(c => c.id === item.id);
        const availableStock = item.stock - (cartItem ? cartItem.qty : 0);
        
        return (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                GHS {parseFloat(item.price).toFixed(2)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            
            <div className="text-sm text-gray-500 mb-3">
              Stock: {availableStock} | Category: {item.category || 'Uncategorized'}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={availableStock}
                defaultValue="1"
                className="w-16 px-2 py-1 border rounded"
                id={`qty-${item.id}`}
                disabled={availableStock <= 0}
              />
              <button
                onClick={() => {
                  const qty = parseInt(document.getElementById(`qty-${item.id}`).value) || 1;
                  handleAddToCart(item, qty);
                }}
                disabled={availableStock <= 0}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                  availableStock <= 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {availableStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;