import React, { useState } from 'react';
import { useCart } from '../services/CartContext';

const MenuGrid = ({ menu }) => {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, parseInt(quantity) || 1)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    if (item.stock < quantity) {
      alert(`Not enough stock! Only ${item.stock} available.`);
      return;
    }
    addToCart(item, quantity);
    // Reset quantity to 1 after adding
    setQuantities(prev => ({
      ...prev,
      [item.id]: 1
    }));
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'stock-out' };
    if (stock <= 5) return { text: `Low Stock (${stock})`, class: 'stock-low' };
    return { text: `In Stock (${stock})`, class: 'text-success' };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {menu.map((item) => {
        const stockStatus = getStockStatus(item.stock);
        const quantity = quantities[item.id] || 1;
        
        return (
          <div key={item.id} className="card menu-card">
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-lg">{item.name}</h5>
                <span className="text-danger font-bold text-lg">
                  GHS {item.price.toFixed(2)}
                </span>
              </div>
              
              <div className={`text-sm mb-3 ${stockStatus.class}`}>
                {stockStatus.text}
              </div>
              
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="form-control w-20 text-center"
                  disabled={item.stock === 0}
                />
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock === 0}
                  className="btn btn-danger flex-1"
                >
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
      
      {menu.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted">
          No menu items available
        </div>
      )}
    </div>
  );
};

export default MenuGrid;