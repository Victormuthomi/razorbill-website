import { Link } from "react-router-dom";
import { Play, Monitor, Layers } from "lucide-react";
import bill from "../assets/bill.png";

export default function Movies() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center text-white py-20 px-6 sm:px-8 md:px-12 overflow-hidden">
      
      {/* Structural Decor - The Alcodist Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-4xl w-full relative z-10">
        {/* Badge Telemetry */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-lab-emerald/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-lab-emerald">
            Multiplex Protocol v2.0
          </span>
          <div className="h-px w-8 bg-lab-emerald/40" />
        </div>

        {/* Title: High-Contrast & Italicized for Speed */}
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9]">
          Cinema<span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-emerald to-lab-cobalt">.Stream</span>
        </h2>

        <p className="font-mono text-xs sm:text-sm uppercase tracking-widest max-w-2xl mx-auto mb-8 text-lab-slate leading-relaxed">
          Decrypting global entertainment. Access ultra-high fidelity 
          <span className="text-white"> Cinema</span>, 
          <span className="text-white"> Series</span>, and 
          <span className="text-white"> Live Nodes</span> from a single interface.
        </p>

        {/* The Pen Asset: Integrated with a "Platform" shadow */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-lab-emerald/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <img
            src={bill}
            alt="bill"
            className="relative w-40 md:w-72 mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:rotate-3 hover:scale-110"
          />
        </div>
      </div>

      {/* Action Architecture */}
      <div className="mt-16 md:mt-24 group">
        <Link to="/movies/home" className="relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-2xl overflow-hidden transition-all duration-300 hover:pr-16 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <span className="font-black text-[12px] uppercase tracking-[0.3em] relative z-10">
            Initialize Cinema
          </span>
          <Play size={18} fill="black" className="relative z-10" />
          
          {/* Subtle button sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-lab-emerald to-lab-cobalt opacity-0 group-hover:opacity-10 transition-opacity" />
        </Link>

        {/* Meta Stats */}
        <div className="mt-8 flex justify-center gap-8 font-mono text-[9px] text-lab-slate uppercase tracking-widest opacity-40">
          <span className="flex items-center gap-2"><Monitor size={10} /> 4K Ready</span>
          <span className="flex items-center gap-2"><Layers size={10} /> 500+ Nodes</span>
        </div>
      </div>
    </section>
  );
}
