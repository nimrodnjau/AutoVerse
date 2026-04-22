import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/fetch.jsx";
import CarCard from "../components/CarCard.jsx";
import Footer from "../components/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

const CATS = ["all", "sedan", "suv", "luxury", "sport", "pickup"];

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchParams] = useSearchParams();

  const fetchCars = useCallback((category = "all", search = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    api.get(`/cars/?${params.toString()}`)
      .then((d) => setCars(d.cars))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    setActiveFilter(cat);
    fetchCars(cat, search);
  }, [searchParams, fetchCars]);

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    fetchCars(cat);
  };

  return (
    <div>
      <div className="px-8 py-10">
        <div className="flex justify-between items-baseline mb-6">
          <h1 className="font-head text-4xl tracking-widest">ALL INVENTORY</h1>
          <span className="text-brand-gray-4 text-sm">{cars.length} vehicles found</span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-5 py-1.5 rounded-full text-xs tracking-wide border transition-all duration-200 ${
                activeFilter === cat
                  ? "bg-brand-red border-brand-red text-white"
                  : "border-brand-gray-3 text-brand-gray-5 hover:border-brand-gray-4 hover:text-white"
              }`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : cars.length === 0 ? (
          <p className="text-center py-20 text-brand-gray-4">No vehicles found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}