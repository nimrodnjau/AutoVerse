import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/fetch.jsx";
import { useCart } from "../context/CartContext.jsx";
import Footer from "../components/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

const BADGE = {
  hot: "bg-brand-red text-white",
  new: "bg-brand-gold text-black",
  sale: "bg-brand-red/50 text-white border border-brand-red",
};

const fmt = (n) => "KES " + Number(n).toLocaleString();

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [car, setCar] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then((d) => setCar(d.car))
      .catch(() => navigate("/catalog"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Spinner />;
  if (!car) return null;

  const specs = [
    ["Year", car.year],
    ["Mileage", `${car.mileage} km`],
    ["Engine", car.engine],
    ["Power", car.power],
    ["Fuel Type", car.fuel_type],
    ["Color", car.color],
  ];

  return (
    <div>
      <div className="px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 border border-brand-gray-3 text-brand-gray-5 px-4 py-2 rounded text-sm hover:border-brand-gray-4 hover:text-white transition-colors mb-8"
        >
          ← Back to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-brand-gray border border-brand-gray-2 rounded-xl h-80 flex items-center justify-center text-[140px]">
            {car.emoji}
          </div>

          {/* Info */}
          <div>
            <p className="text-[12px] text-brand-red tracking-[3px] uppercase mb-2">{car.brand}</p>
            <h1 className="font-head text-5xl tracking-wide leading-tight mb-3">{car.name}</h1>
            {car.badge && (
              <span className={`inline-block text-[10px] tracking-widest uppercase px-3 py-1 rounded mb-4 ${BADGE[car.badge] || ""}`}>
                {car.badge}
              </span>
            )}
            <p className="font-head text-5xl text-brand-red mb-3">{fmt(car.price)}</p>
            <p className="text-brand-gray-5 text-sm leading-relaxed font-light mb-6">{car.description}</p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {specs.map(([label, val]) => (
                <div key={label} className="bg-[#111] border border-white/10 rounded-md px-4 py-3">
                  <p className="text-[10px] tracking-[2px] uppercase text-brand-gray-4 mb-1">{label}</p>
                  <p className="text-[15px] font-medium">{val}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center border border-brand-gray-3 rounded overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="bg-brand-gray-2 text-white w-10 h-11 text-xl hover:bg-brand-gray-3 transition-colors"
                >−</button>
                <span className="px-5 text-base font-medium min-w-[44px] text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(5, q + 1))}
                  className="bg-brand-gray-2 text-white w-10 h-11 text-xl hover:bg-brand-gray-3 transition-colors"
                >+</button>
              </div>
              <button
                onClick={() => addToCart(car, qty)}
                className="flex-1 bg-brand-red text-white py-3 rounded font-medium text-sm hover:bg-brand-red-dark transition-colors"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="border border-brand-gray-3 text-white px-4 py-3 rounded hover:border-brand-gray-4 transition-colors"
              >
                🛒
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}