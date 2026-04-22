import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reference = state?.reference || "AV-2026-XXXX";

  return (
    <div>
      <div className="max-w-xl mx-auto px-8 py-20 text-center">
        <div className="text-8xl mb-6">✅</div>
        <h1 className="font-head text-6xl tracking-widest mb-3">ORDER PLACED!</h1>
        <p className="text-brand-gray-5 text-base leading-relaxed font-light mb-8">
          Thank you for your purchase. Your vehicle has been reserved and our team will contact you within 24 hours to arrange delivery and final documentation.
        </p>
        <div className="bg-brand-gray border border-brand-gray-2 rounded-lg px-8 py-6 mb-10">
          <p className="text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-2">Order Reference</p>
          <p className="font-head text-3xl text-brand-red tracking-widest">{reference}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/")} className="bg-brand-red text-white px-8 py-3 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors">
            BACK TO SHOWROOM
          </button>
          <button onClick={() => navigate("/orders")} className="border border-brand-gray-3 text-white px-8 py-3 rounded text-sm font-medium hover:border-brand-gray-4 transition-colors">
            VIEW MY ORDERS
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}