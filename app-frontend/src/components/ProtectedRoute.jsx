import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-brand-gray-4 text-lg">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}