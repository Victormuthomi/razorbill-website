import React from "react";
import Hero from "../components/Hero";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* The Layout.jsx already provides the background mesh and 
        sidebar/navigation, so the HomePage stays ultra-lean.
      */}
      <main className="flex-grow flex items-center justify-center">
        <Hero />
      </main>

      {/* Optional: Add a "Quick Stats" or "Trending" bar below the Hero if needed */}
      <div className="w-full py-8 px-6 opacity-20 hover:opacity-100 transition-opacity duration-700">
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between items-center font-mono text-[10px] text-lab-slate uppercase tracking-[0.3em]">
          <span>Build v3.1.0</span>
          <span className="hidden md:inline">
            Open Source Architecture by Alcodist
          </span>
          <span>Nairobi_Node_Active</span>
        </div>
      </div>
    </div>
  );
}
