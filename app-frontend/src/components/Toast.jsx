import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function Toast() {
  const { toast } = useCart();
  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-brand-gray border border-brand-red text-white px-5 py-4 rounded-lg text-sm max-w-xs transition-transform duration-300 ${toast.show ? "translate-y-0" : "translate-y-40"}`}>
      {toast.msg}
    </div>
  );
}