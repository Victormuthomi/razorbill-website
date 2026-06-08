import React from "react";
import Hero from "../components/Hero";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* 
        The Layout.jsx already provides the background mesh and 
        sidebar/navigation, so the HomePage stays ultra-lean.
      */}
      <main className="flex-grow flex items-center justify-center">
        <Hero />
      </main>

      {/* Meta Informational Footer Bar */}
      <div className="w-full py-8 px-6 opacity-30 hover:opacity-100 transition-opacity duration-500">
        <div className="max-w-6xl mx-auto border-t border-zinc-900 pt-8 flex justify-between items-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          <span>Build v3.1.0</span>
          <span className="hidden md:inline">
            High-Performance Sports Architecture
          </span>
          <span>Edge_Node_Connected</span>
        </div>
      </div>
    </div>
  );
}
