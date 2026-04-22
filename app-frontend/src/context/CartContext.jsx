import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const addToCart = (car, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === car.id);
      if (existing) return prev.map((i) => i.id === car.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...car, qty }];
    });
    showToast(`🚗 ${car.name} added to cart!`);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal, vat, total, toast }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);