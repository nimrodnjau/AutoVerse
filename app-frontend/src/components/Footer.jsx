import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 px-8 py-6 flex justify-between items-center mt-16">
      <span className="font-head text-xl tracking-widest text-brand-gray-4">
        AUTO<span className="text-brand-red">VERSE</span>
      </span>
      <div className="flex gap-6">
        {["Privacy Policy", "Terms", "Contact", "Support"].map((l) => (
          <a key={l} href="#" className="text-brand-gray-4 text-xs tracking-wide hover:text-white transition-colors">{l}</a>
        ))}
      </div>
      <span className="text-[#444] text-xs">© 2026 AutoVerse Kenya. All rights reserved.</span>
    </footer>
  );
}