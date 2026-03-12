import React, { useState, useMemo } from "react";
import { Activity, Calendar, Trophy, BarChart3 } from "lucide-react";
import LiveMatches from "../components/LiveMatches";
import TodaysMatches from "../components/TodaysMatches";
import Results from "../components/Results";
import razor from "../assets/razor.jpeg";

export default function MatchesPage() {
  // Tabs: Live, Scheduled (Today), Results
  const [activeTab, setActiveTab] = useState("live");

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 15, 0.8), rgba(10, 10, 15, 0.95)), url(${razor})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }),
    []
  );

  const tabs = [
    { id: "live", label: "Live Uplinks", icon: <Activity size={16} /> },
    { id: "today", label: "Today's Schedule", icon: <Calendar size={16} /> },
    { id: "results", label: "Historical Data", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div
      className="min-h-screen transition-all duration-700"
      style={backgroundStyle}
    >
      {/* Header Intelligence */}
      <header className="pt-16 pb-8 px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-lab-slate text-[10px] font-mono uppercase tracking-[0.3em]">
          <Trophy size={12} className="text-lab-emerald" /> Tournament
          Intelligence Node
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">
          MATCH
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-emerald to-lab-cobalt">
            .CENTRE
          </span>
        </h1>

        <p className="font-mono text-[10px] md:text-xs text-lab-slate uppercase tracking-[0.4em] opacity-60">
          Real-time telemetry and global match archiving.
        </p>
      </header>

      {/* Segmented Control (The Tab Switcher) */}
      <div className="sticky top-20 z-40 flex justify-center px-4 pb-10">
        <div className="inline-flex p-1.5 bg-obsidian-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-white text-black font-black shadow-lg"
                    : "text-lab-slate hover:text-white hover:bg-white/5"
                }
              `}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Viewport: Dynamic Content Loading */}
      <main className="max-w-7xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === "live" && (
          <div className="space-y-6">
            <LiveMatches />
          </div>
        )}

        {activeTab === "today" && (
          <div className="space-y-6">
            <TodaysMatches />
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-6">
            <Results />
          </div>
        )}
      </main>

      {/* Global Footer Meta */}
      <footer className="py-10 border-t border-white/5 flex flex-col items-center gap-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-lab-emerald to-transparent" />
        <p className="font-mono text-[8px] text-lab-slate uppercase tracking-[0.5em] opacity-40">
          Alcodist Infrastructure Protocol v3.1
        </p>
      </footer>
    </div>
  );
}
