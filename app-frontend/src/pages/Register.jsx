import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register({ first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone, password: form.password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    [["first_name", "First Name", "text"], ["last_name", "Last Name", "text"]],
    [["email", "Email Address", "email"], ["phone", "Phone Number", "tel"]],
    [["password", "Password", "password"], ["confirm", "Confirm Password", "password"]],
  ];

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-brand-gray border border-brand-gray-2 rounded-xl p-10">
        <div className="text-center mb-8">
          <p className="font-head text-2xl tracking-widest mb-6">AUTO<span className="text-brand-red">VERSE</span></p>
          <h1 className="font-head text-3xl tracking-widest mb-2">CREATE ACCOUNT</h1>
          <p className="text-brand-gray-4 text-sm">Join AutoVerse and start your journey to the perfect car.</p>
        </div>
        {error && <div className="bg-red-900/40 border border-brand-red text-red-300 px-4 py-3 rounded text-sm mb-5">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((row, ri) => (
            <div key={ri} className="grid grid-cols-2 gap-4">
              {row.map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">{label}</label>
                  <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type={type} name={name} value={form[name]} onChange={handleChange} placeholder={name === "phone" ? "0712345678" : ""} required={name !== "phone"} />
                </div>
              ))}
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-3 rounded font-medium text-sm hover:bg-brand-red-dark transition-colors disabled:opacity-60 mt-2">
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>
        <p className="text-center text-brand-gray-4 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-red hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}