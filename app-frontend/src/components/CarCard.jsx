import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const BADGE = {
  hot: "bg-brand-red text-white",
  new: "bg-brand-gold text-black",
  sale: "bg-brand-red/50 text-white border border-brand-red",
};

const fmt = (n) => "KES " + Number(n).toLocaleString();

export default function CarCard({ car }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div
      className="bg-brand-gray border border-brand-gray-2 rounded-lg overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-brand-gray-3 transition-all duration-200"
      onClick={() => navigate(`/car/${car.id}`)}
    >
      <div className="h-44 bg-[#111] flex items-center justify-center relative">
        <span className="text-8xl">{car.emoji}</span>
        {car.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded ${BADGE[car.badge] || "bg-brand-red text-white"}`}>
            {car.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] text-brand-gray-4 tracking-widest uppercase mb-1">{car.brand}</p>
        <h3 className="font-head text-2xl tracking-wide mb-2">{car.name}</h3>
        <div className="flex gap-4 text-[12px] text-brand-gray-4 mb-3">
          <span>📅 {car.year}</span>
          <span>🔢 {car.mileage} km</span>
          <span>⛽ {car.fuel_type}</span>
        </div>
        <div className="mb-3">
          <p className="font-head text-2xl text-brand-red">{fmt(car.price)}</p>
          <p className="text-[11px] text-brand-gray-4">from KES {Math.round(car.price / 60).toLocaleString()}/mo</p>
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/car/${car.id}`)}
            className="flex-1 py-2 text-xs font-medium border border-brand-gray-3 text-white rounded hover:bg-brand-gray-2 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => addToCart(car, 1)}
            className="flex-1 py-2 text-xs font-medium bg-brand-red text-white rounded hover:bg-brand-red-dark transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}