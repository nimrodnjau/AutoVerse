import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/fetch.jsx";
import Footer from "../components/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

const fmt = (n) => "KES " + Math.round(n).toLocaleString();

export default function Checkout() {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    delivery_address: "",
    payment_method: "mpesa",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("details");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [polling, setPolling] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.delivery_address) { setError("Please enter a delivery address."); return; }

    setLoading(true);
    try {
      const orderData = await api.post("/orders/", {
        items: cart.map((i) => ({ car_id: i.id, quantity: i.qty })),
        delivery_address: form.delivery_address,
        phone: form.phone,
        payment_method: form.payment_method,
      }, true);

      const order = orderData.order;

      if (form.payment_method === "mpesa") {
        const stkData = await api.post("/payments/stk-push", { order_id: order.id, phone: form.phone }, true);
        setMpesaPhone(form.phone);
        setStep("mpesa");
        pollPayment(stkData.checkout_request_id, order.reference);
      } else {
        clearCart();
        navigate("/order-success", { state: { reference: order.reference } });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pollPayment = (reqId, ref) => {
    setPolling(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await api.get(`/payments/status/${reqId}`, true);
        if (res.payment.status === "success") {
          clearInterval(interval);
          setPolling(false);
          clearCart();
          navigate("/order-success", { state: { reference: ref } });
        } else if (res.payment.status === "failed") {
          clearInterval(interval);
          setPolling(false);
          setError("Payment failed. Please try again.");
          setStep("details");
        }
      } catch {}
      if (attempts >= 12) {
        clearInterval(interval);
        setPolling(false);
        setError("Payment timed out. Check your M-Pesa and try again.");
        setStep("details");
      }
    }, 5000);
  };

  const STEPS = ["Cart", "Details", "Payment", "Confirm"];

  return (
    <div>
      <div className="px-8 py-10 max-w-3xl mx-auto">
        <h1 className="font-head text-5xl tracking-widest mb-2">CHECKOUT</h1>
        <p className="text-brand-gray-4 text-sm mb-8">Complete your purchase securely</p>

        {/* Steps */}
        <div className="flex mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 text-center py-3 text-xs tracking-widest uppercase border-b-2 transition-colors ${
                i === 0 ? "border-brand-red text-brand-red" :
                i === 1 ? "border-brand-red text-white" :
                "border-brand-gray-2 text-brand-gray-4"
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {step === "mpesa" ? (
          <div className="text-center py-16">
            <div className="text-7xl mb-5">📱</div>
            <h2 className="font-head text-4xl tracking-widest mb-4">CHECK YOUR PHONE</h2>
            <p className="text-brand-gray-5 text-base leading-relaxed mb-8">
              An M-Pesa STK Push has been sent to <strong>{mpesaPhone}</strong>.<br />
              Enter your M-Pesa PIN to complete payment of <strong>{fmt(total)}</strong>.
            </p>
            {polling && <Spinner />}
            {error && <div className="bg-red-900/40 border border-brand-red text-red-300 px-4 py-3 rounded text-sm mb-6">{error}</div>}
            <button onClick={() => { setStep("details"); setError(""); }} className="border border-brand-gray-3 text-brand-gray-5 px-6 py-2 rounded text-sm hover:text-white hover:border-brand-gray-4 transition-colors">
              ← Change Payment Method
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-900/40 border border-brand-red text-red-300 px-4 py-3 rounded text-sm mb-6">{error}</div>}

            {/* Personal Info */}
            <p className="font-head text-xl tracking-widest text-brand-gold border-t border-white/10 pt-5 mb-5">Personal Information</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[["first_name", "First Name", "text"], ["last_name", "Last Name", "text"]].map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">{label}</label>
                  <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type={type} name={name} value={form[name]} onChange={handleChange} required />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[["email", "Email Address", "email"], ["phone", "Phone (M-Pesa)", "tel"]].map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">{label}</label>
                  <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" type={type} name={name} value={form[name]} onChange={handleChange} placeholder={name === "phone" ? "0712345678" : ""} required />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Delivery Address</label>
              <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red transition-colors" name="delivery_address" value={form.delivery_address} onChange={handleChange} placeholder="Street, City, County" required />
            </div>

            {/* Payment Method */}
            <p className="font-head text-xl tracking-widest text-brand-gold border-t border-white/10 pt-5 mb-5 mt-6">Payment Method</p>
            <div className="flex gap-3 mb-5">
              {[["mpesa", "📱 M-Pesa"], ["card", "💳 Card"], ["bank", "🏦 Bank Transfer"]].map(([val, label]) => (
                <div
                  key={val}
                  onClick={() => setForm((f) => ({ ...f, payment_method: val }))}
                  className={`flex-1 bg-[#111] border-2 rounded px-4 py-3 text-sm text-center cursor-pointer transition-all ${form.payment_method === val ? "border-brand-red text-white" : "border-brand-gray-3 text-brand-gray-4 hover:border-brand-gray-4"}`}
                >
                  {label}
                </div>
              ))}
            </div>

            {form.payment_method === "card" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">Card Number</label>
                  <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red" placeholder="4242 4242 4242 4242" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[2px] uppercase text-brand-gray-4 mb-1.5">CVV / Expiry</label>
                  <input className="w-full bg-[#111] border border-brand-gray-3 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-brand-red" placeholder="123 / 12/28" />
                </div>
              </div>
            )}

            {/* Total Bar */}
            <div className="flex justify-between items-center bg-[#111] border border-white/10 px-5 py-4 rounded-md my-6">
              <span className="text-sm text-brand-gray-4">Total to pay:</span>
              <span className="font-head text-3xl text-brand-red">{fmt(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red text-white py-4 rounded font-head text-2xl tracking-widest hover:bg-brand-red-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "PROCESSING..." : form.payment_method === "mpesa" ? "📱 PAY WITH M-PESA" : "PLACE ORDER"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}