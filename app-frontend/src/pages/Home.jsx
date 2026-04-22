import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/fetch.jsx";
import CarCard from "../components/CarCard.jsx";
import Footer from "../components/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cars/featured")
      .then((d) => setFeatured(d.cars))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[520px] overflow-hidden bg-gradient-to-br from-brand-black via-[#1a0a0a] to-brand-black">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 60L60 0' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E\")" }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center px-10 max-w-xl">
          <p className="text-[11px] tracking-[3px] uppercase text-brand-red font-medium mb-4">
            Kenya's Premier Auto Marketplace
          </p>
          <h1 className="font-head text-7xl leading-none tracking-wide mb-5">
            DRIVE YOUR<br />DREAM CAR
          </h1>
          <p className="text-brand-gray-5 text-[15px] leading-relaxed mb-8 font-light">
            Browse thousands of verified vehicles. Transparent pricing, secure M-Pesa payments, and doorstep delivery across East Africa.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/catalog")} className="bg-brand-red text-white px-8 py-3 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors">
              Browse Inventory
            </button>
            <button onClick={() => navigate("/catalog")} className="border border-brand-gray-3 text-white px-8 py-3 rounded text-sm font-medium hover:border-white transition-colors">
              Value My Car
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-8 left-10 flex gap-12 z-10">
          {[["2,400+", "Cars Listed"], ["850+", "Happy Buyers"], ["40+", "Brands"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-head text-4xl text-brand-red">{num}</div>
              <div className="text-[11px] text-brand-gray-4 tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-brand-gray border-b border-white/10 px-10 py-5">
        <form className="flex gap-3 max-w-4xl" onSubmit={handleSearch}>
          <input
            className="flex-[2] bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors"
            placeholder="Search by make or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="flex-1 bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none appearance-none max-w-[180px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["all", "sedan", "suv", "luxury", "sport", "pickup"].map((c) => (
              <option key={c} value={c}>{c === "all" ? "Any Category" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button type="submit" className="bg-brand-red text-white px-7 py-3 rounded font-head text-xl tracking-wide hover:bg-brand-red-dark transition-colors whitespace-nowrap">
            SEARCH
          </button>
        </form>
      </div>

      {/* Featured */}
      <div className="px-8 py-10">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="font-head text-4xl tracking-widest">FEATURED VEHICLES</h2>
          <button onClick={() => navigate("/catalog")} className="text-brand-red text-sm tracking-wide hover:underline">
            VIEW ALL →
          </button>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>

      {/* Value props */}
      <div className="px-8 pb-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          ["🔒", "Verified Listings", "Every car is inspected and verified by our team before listing."],
          ["📱", "M-Pesa Payments", "Pay securely using M-Pesa STK Push. No hidden charges."],
          ["🚚", "Free Delivery", "We deliver your car to your doorstep anywhere in Kenya."],
        ].map(([icon, title, desc]) => (
          <div key={title} className="bg-brand-gray border border-brand-gray-2 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-head text-xl tracking-wide mb-2">{title}</h3>
            <p className="text-brand-gray-4 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}