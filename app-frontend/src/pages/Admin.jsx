import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/fetch.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

const EMPTY_FORM = {
  brand: "", name: "", year: "", price: "", category: "sedan",
  mileage: "", fuel_type: "Petrol", engine: "", power: "",
  color: "", description: "", badge: "", emoji: "🚗", in_stock: true,
};

const CATEGORIES = ["sedan", "suv", "luxury", "sport", "pickup"];
const BADGES = ["", "new", "hot", "sale"];
const EMOJIS = ["🚗", "🚙", "🚘", "🚛", "🏎"];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.is_admin) { navigate("/"); return; }
    fetchCars();
  }, [user]);

  const fetchCars = () => {
    setLoading(true);
    api.get("/cars/")
      .then((d) => setCars(d.cars))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setForm({
      brand: car.brand, name: car.name, year: car.year,
      price: car.price, category: car.category, mileage: car.mileage,
      fuel_type: car.fuel_type, engine: car.engine, power: car.power,
      color: car.color, description: car.description,
      badge: car.badge || "", emoji: car.emoji, in_stock: car.in_stock,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleNew = () => {
    setEditingCar(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        year: parseInt(form.year),
        price: parseFloat(form.price),
        badge: form.badge || null,
      };
      if (editingCar) {
        await api.post(`/cars/${editingCar.id}`, payload, true, "PUT");
        setSuccess("Car updated successfully!");
      } else {
        await api.post("/cars/", payload, true);
        setSuccess("Car added successfully!");
      }
      fetchCars();
      setShowForm(false);
      setEditingCar(null);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm(`Delete ${car.brand} ${car.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/cars/${car.id}`, true);
      setSuccess("Car deleted.");
      fetchCars();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  };

  const fmt = (n) => "KES " + Number(n).toLocaleString();

  return (
    <div>
      <div className="px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-head text-5xl tracking-widest">ADMIN DASHBOARD</h1>
            <p className="text-brand-gray-4 text-sm mt-1">Manage your vehicle inventory</p>
          </div>
          <button
            onClick={handleNew}
            className="bg-brand-red text-white px-6 py-3 rounded font-head text-xl tracking-widest hover:bg-brand-red-dark transition-colors"
          >
            + ADD NEW CAR
          </button>
        </div>

        {error && <div className="bg-red-900/40 border border-brand-red text-red-300 px-4 py-3 rounded text-sm mb-5">{error}</div>}
        {success && <div className="bg-green-900/40 border border-green-500 text-green-300 px-4 py-3 rounded text-sm mb-5">{success}</div>}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-brand-gray border border-brand-gray-2 rounded-xl p-8 mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-head text-3xl tracking-widest text-brand-gold">
                {editingCar ? `EDITING — ${editingCar.brand} ${editingCar.name}` : "ADD NEW VEHICLE"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-brand-gray-4 hover:text-white text-2xl transition-colors">✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[["brand", "Brand", "text"], ["name", "Model Name", "text"]].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">{label}</label>
                    <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type={type} name={name} value={form[name]} onChange={handleChange} required />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {[["year", "Year", "number"], ["price", "Price (KES)", "number"], ["mileage", "Mileage (km)", "text"]].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">{label}</label>
                    <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type={type} name={name} value={form[name]} onChange={handleChange} required />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Category</label>
                  <select className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red appearance-none" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Fuel Type</label>
                  <select className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red appearance-none" name="fuel_type" value={form.fuel_type} onChange={handleChange}>
                    {["Petrol", "Diesel", "Hybrid", "Electric"].map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Badge</label>
                  <select className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red appearance-none" name="badge" value={form.badge} onChange={handleChange}>
                    {BADGES.map((b) => <option key={b} value={b}>{b === "" ? "None" : b.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {[["engine", "Engine", "text"], ["power", "Power (hp)", "text"], ["color", "Color", "text"]].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">{label}</label>
                    <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type={type} name={name} value={form[name]} onChange={handleChange} />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Emoji Icon</label>
                <div className="flex gap-3">
                  {EMOJIS.map((e) => (
                    <button key={e} type="button" onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                      className={`text-3xl p-2 rounded border-2 transition-all ${form.emoji === e ? "border-brand-red" : "border-brand-gray-3"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Description</label>
                <textarea className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors h-24 resize-none" name="description" value={form.description} onChange={handleChange} />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <input type="checkbox" name="in_stock" checked={form.in_stock} onChange={handleChange} className="w-4 h-4 accent-brand-red" />
                <label className="text-sm text-brand-gray-5">In Stock (visible to customers)</label>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="bg-brand-red text-white px-8 py-3 rounded font-head text-xl tracking-widest hover:bg-brand-red-dark transition-colors disabled:opacity-60">
                  {submitting ? "SAVING..." : editingCar ? "UPDATE CAR" : "ADD CAR"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-brand-gray-3 text-white px-8 py-3 rounded font-head text-xl tracking-widest hover:border-brand-gray-4 transition-colors">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cars Table */}
        {loading ? <Spinner /> : (
          <div className="bg-brand-gray border border-brand-gray-2 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-gray-2 flex justify-between items-center">
              <h2 className="font-head text-2xl tracking-widest">INVENTORY ({cars.length} vehicles)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-gray-2 bg-[#111]">
                    {["Vehicle", "Category", "Year", "Price", "Status", "Badge", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-brand-gray-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, i) => (
                    <tr key={car.id} className={`border-b border-brand-gray-2 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{car.emoji}</span>
                          <div>
                            <p className="font-medium text-sm">{car.name}</p>
                            <p className="text-brand-gray-4 text-xs">{car.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-gray-5 capitalize">{car.category}</td>
                      <td className="px-4 py-3 text-sm text-brand-gray-5">{car.year}</td>
                      <td className="px-4 py-3 text-sm text-brand-red font-head text-base">{fmt(car.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded ${car.in_stock ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
                          {car.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {car.badge ? (
                          <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded ${car.badge === "new" ? "bg-brand-gold/20 text-brand-gold" : "bg-brand-red/20 text-brand-red"}`}>
                            {car.badge}
                          </span>
                        ) : <span className="text-brand-gray-4 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(car)} className="border border-brand-gray-3 text-white text-xs px-3 py-1.5 rounded hover:border-brand-gold hover:text-brand-gold transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(car)} className="border border-brand-gray-3 text-white text-xs px-3 py-1.5 rounded hover:border-brand-red hover:text-brand-red transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}