import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-10 h-10 border-4 border-brand-gray-2 border-t-brand-red rounded-full animate-spin" />
    </div>
  );
}