import React, { useEffect, useState } from "react";
import { api } from "../api/fetch.jsx";
import Footer from "../components/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

const fmt = (n) => "KES " + Math.round(n).toLocaleString();

const STATUS_COLORS = {
  paid: "text-green-400",
  pending: "text-brand-gold",
  cancelled: "text-brand-red",
  processing: "text-blue-400",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/", true)
      .then((d) => setOrders(d.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="px-8 py-10">
        <h1 className="font-head text-5xl tracking-widest mb-8">MY ORDERS</h1>
        {loading ? <Spinner /> : orders.length === 0 ? (
          <p className="text-center py-20 text-brand-gray-4">No orders yet. Start shopping!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-brand-gray border border-brand-gray-2 rounded-lg overflow-hidden">
                <div className="flex justify-between items-start px-5 py-5 border-b border-brand-gray-2">
                  <div>
                    <p className="font-head text-2xl text-brand-red tracking-wide">{order.reference}</p>
                    <p className="text-brand-gray-4 text-xs mt-1">
                      {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-head text-2xl">{fmt(order.total_amount)}</p>
                    <p className={`text-[11px] tracking-widest mt-1 ${STATUS_COLORS[order.status] || "text-brand-gray-4"}`}>
                      {order.status.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <span className="text-2xl">{item.car?.emoji}</span>
                      <span className="flex-1">{item.car?.brand} {item.car?.name}</span>
                      <span className="text-brand-gray-4">× {item.quantity}</span>
                      <span className="text-brand-red ml-auto">{fmt(item.price_at_purchase)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-5 py-3 border-t border-brand-gray-2 bg-[#111] text-xs text-brand-gray-4">
                  <span>📍 {order.delivery_address}</span>
                  <span>💳 {order.payment_method?.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}