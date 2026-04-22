import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-brand-gray border border-brand-gray-2 rounded-xl p-10">
        <div className="text-center mb-8">
          <p className="font-head text-2xl tracking-widest mb-6">AUTO<span className="text-brand-red">VERSE</span></p>
          <h1 className="font-head text-3xl tracking-widest mb-2">SIGN IN</h1>
          <p className="text-brand-gray-4 text-sm">Welcome back. Enter your credentials to continue.</p>
        </div>
        {error && <div className="bg-red-900/40 border border-brand-red text-red-300 px-4 py-3 rounded text-sm mb-5">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Email Address</label>
            <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Password</label>
            <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-3 rounded font-medium text-sm hover:bg-brand-red-dark transition-colors disabled:opacity-60 mt-2">
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
        <p className="text-center text-brand-gray-4 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-red hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}