import React from "react";
import { Link } from "react-router-dom";
import { Database, ChevronRight, Activity, Terminal } from "lucide-react";

const Results = () => {
  return (
    <div 
      className="relative w-full rounded-[3rem] overflow-hidden border border-white/5 my-12 bg-obsidian-950"
      style={{ height: "500px" }}
    >
      {/* Visual Layer: Technical Grid & Mesh */}
      <div className="absolute inset-0 z-0">
        {/* The Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        {/* The Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.08),transparent_70%)]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        
        {/* Scanner Animation */}
        <div className="relative mb-8">
          <div className="absolute -inset-8 bg-lab-emerald/10 blur-3xl animate-pulse rounded-full" />
          <div className="relative flex items-center justify-center bg-obsidian-900 border border-white/10 w-20 h-20 rounded-[2rem] shadow-2xl">
            <Database className="text-lab-emerald" size={32} />
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-lab-emerald/40" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-lab-emerald/40" />
          </div>
        </div>

        <div className="space-y-6 max-w-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-emerald/5 border border-lab-emerald/20 text-lab-emerald font-mono text-[9px] uppercase tracking-[0.4em]">
              <Activity size={10} className="animate-pulse" /> Uplink: Established
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
            DATA<span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-emerald to-lab-cobalt">.ARCHIVE</span>
          </h2>
          
          <p className="font-mono text-[10px] text-lab-slate uppercase tracking-[0.3em] leading-relaxed opacity-60 px-4 max-w-md mx-auto">
            System is currently executing <span className="text-white">Deep-Sync Protocols</span> across global endpoints. Historical metrics are encrypted until verification.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Link
            to="/results"
            className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:pr-14 active:scale-95 shadow-xl"
          >
            Access Terminal <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          
          <div className="flex items-center gap-2 text-[8px] font-mono text-lab-slate/40 uppercase tracking-[0.5em]">
            <Terminal size={10} /> Root Access Required
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lab-emerald/20 to-transparent" />
    </div>
  );
};

export default Results;
