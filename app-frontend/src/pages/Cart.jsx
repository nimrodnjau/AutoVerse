import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

const fmt = (n) => "KES " + Math.round(n).toLocaleString();

export default function Cart() {
  const { cart, removeFromCart, updateQty, subtotal, vat, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div>
        <div className="text-center px-8 py-24">
          <div className="text-7xl mb-5 opacity-30">🛒</div>
          <h2 className="font-head text-4xl tracking-widest mb-3">YOUR CART IS EMPTY</h2>
          <p className="text-brand-gray-4 mb-8 text-sm">Browse our inventory to find your perfect car</p>
          <button onClick={() => navigate("/catalog")} className="bg-brand-red text-white px-8 py-3 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors">
            Browse Cars
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="px-8 py-10">
        <h1 className="font-head text-5xl tracking-widest mb-8">YOUR CART</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Items */}
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-brand-gray border border-brand-gray-2 rounded-lg p-4 flex gap-4 items-center">
                <div className="w-20 h-16 bg-[#111] rounded-md flex items-center justify-center text-4xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-head text-xl tracking-wide mb-1">{item.name}</h3>
                  <p className="text-brand-gray-4 text-xs mb-2">{item.brand} · {item.year} · {item.mileage} km</p>
                  <p className="font-head text-xl text-brand-red">{fmt(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-brand-gray-3 rounded overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="bg-brand-gray-2 text-white w-8 h-9 text-base hover:bg-brand-gray-3">−</button>
                    <span className="px-3 text-sm font-medium min-w-[32px] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="bg-brand-gray-2 text-white w-8 h-9 text-base hover:bg-brand-gray-3">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-brand-gray-4 hover:text-brand-red text-lg transition-colors">✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-brand-gray border border-brand-gray-2 rounded-lg p-6 h-fit">
            <h2 className="font-head text-2xl tracking-wide mb-5">ORDER SUMMARY</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brand-gray-4">Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-brand-gray-4">VAT (16%)</span><span>{fmt(vat)}</span></div>
              <div className="flex justify-between"><span className="text-brand-gray-4">Delivery</span><span className="text-green-400">FREE</span></div>
            </div>
            <div className="border-t border-brand-gray-2 my-4" />
            <div className="flex justify-between items-center mb-6">
              <span className="font-head text-2xl">TOTAL</span>
              <span className="font-head text-2xl text-brand-red">{fmt(total)}</span>
            </div>
            <button
              onClick={() => user ? navigate("/checkout") : navigate("/login")}
              className="w-full bg-brand-red text-white py-4 rounded font-head text-xl tracking-widest hover:bg-brand-red-dark transition-colors"
            >
              {user ? "CHECKOUT →" : "SIGN IN TO CHECKOUT →"}
            </button>
            <p className="text-center text-brand-gray-4 text-[11px] mt-3">🔒 Secured by SSL · M-Pesa · Visa · Mastercard</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}