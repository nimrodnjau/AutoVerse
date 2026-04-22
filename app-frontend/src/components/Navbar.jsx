import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-brand-black/95 backdrop-blur border-b border-white/10">
      <Link to="/" className="font-head text-3xl tracking-widest">
        AUTO<span className="text-brand-red">VERSE</span>
      </Link>

      <ul className="flex gap-6 list-none">
        {[["Home", "/"], ["Inventory", "/catalog"], ...(user ? [["My Orders", "/orders"]] : [])].map(
          ([label, path]) => (
            <li key={path}>
              <Link to={path} className="text-brand-gray-5 text-xs tracking-widest uppercase hover:text-white transition-colors">
                {label}
              </Link>
            </li>
          )
        )}
        {user?.is_admin && (
          <li>
            <Link to="/admin" className="text-brand-gold text-xs tracking-widest uppercase hover:text-white transition-colors">
              ⚙ Admin
            </Link>
          </li>
        )}
      </ul>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-brand-gray-4 text-sm">Hi, {user.first_name}</span>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="border border-brand-gray-3 text-white text-xs px-4 py-2 rounded hover:border-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="border border-brand-gray-3 text-white text-xs px-4 py-2 rounded hover:border-white transition-colors">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-brand-red text-white text-xs px-4 py-2 rounded hover:bg-brand-red-dark transition-colors">
                Register
              </button>
            </Link>
          </>
        )}
        <Link to="/cart" className="relative border border-brand-gray-3 text-white text-xs px-4 py-2 rounded hover:border-brand-gray-3 transition-colors">
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}