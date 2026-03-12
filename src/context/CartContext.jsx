// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Load saved cart from localStorage (if available)
    const saved = localStorage.getItem("cart-items");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addToCart = (product) => {
    setItems((prev) => {
      const found = prev.find((p) => p.title === product.title);
      if (found) {
        return prev.map((p) =>
          p.title === product.title ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Remove item completely
  const removeFromCart = (title) => {
    setItems((prev) => prev.filter((p) => p.title !== title));
  };

  // Update quantity
  const updateQty = (title, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        p.title === title
          ? { ...p, qty: qty <= 0 ? 1 : qty } // prevent zero or negative qty
          : p
      )
    );
  };

  // Clear all items
  const clearCart = () => setItems([]);

  // Derived values
  const total = items.reduce((acc, cur) => acc + Number(cur.price) * cur.qty, 0);
  const count = items.reduce((acc, cur) => acc + cur.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
