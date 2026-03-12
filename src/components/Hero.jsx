import React from "react";
import { Link } from "react-router-dom";
import { Zap, Download, Play, Film, Newspaper, Heart } from "lucide-react";

export default function Hero() {
  const bentoItems = [
    {
      to: "/matches",
      title: "Live Sports",
      description: "Real-time match discovery and streaming telemetry.",
      icon: <Play className="text-lab-emerald" />,
      tag: "Live",
      color: "hover:border-lab-emerald/50",
      span: "md:col-span-2",
    },
    {
      to: "/about", // Now points to the Manifesto/About page
      title: "The Manifesto",
      description:
        "A visual story of empathy, engineering, and the self-taught path.",
      icon: <Heart className="text-lab-emerald fill-lab-emerald/20" />,
      tag: "Identity",
      color: "hover:border-lab-emerald/50",
      span: "md:col-span-1",
    },
    {
      to: "/movies",
      title: "Cinema",
      description: "Federated movie indexing and cinematic archiving.",
      icon: <Film className="text-white" />,
      tag: "4K",
      color: "hover:border-white/20",
      span: "md:col-span-1",
    },
    {
      to: "/blogs",
      title: "Community Logs",
      description: "Open-source publishing platform for the collective voice.",
      icon: <Newspaper className="text-lab-emerald" />,
      tag: "Open Access",
      color: "hover:border-lab-emerald/40",
      span: "md:col-span-2",
    },
  ];

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-lab-emerald/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl w-full space-y-12 md:space-y-20">
        {/* Branding & Headline */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lab-emerald/30 bg-lab-emerald/5 text-lab-emerald text-[10px] font-mono uppercase tracking-[0.2em]">
            <Zap size={12} className="animate-pulse" /> Hub Status: Operational
          </div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight text-white uppercase italic py-2">
            ALCODIST
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-emerald to-white/40">
              .HUB
            </span>
          </h2>

          <p className="font-mono text-[10px] md:text-xs text-lab-slate max-w-2xl mx-auto uppercase tracking-[0.3em] leading-relaxed opacity-70">
            High-Fidelity Engineering //{" "}
            <span className="text-white">Open Source Gift</span> // Cinematic
            Preservation
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
          {bentoItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`${item.span} group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-obsidian-800/40 p-6 md:p-8 transition-all duration-500 backdrop-blur-md ${item.color}`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono border border-white/10 px-2 py-1 rounded text-lab-slate uppercase tracking-widest group-hover:text-white transition-colors">
                    {item.tag}
                  </span>
                </div>

                <div className="mt-8 md:mt-16">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-lab-slate mt-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Background Icon Flair */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-700 rotate-12 group-hover:rotate-0 scale-150">
                {item.icon}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
          <Link
            to="/about"
            className="w-full sm:w-auto px-12 py-4 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-lab-emerald hover:text-white transition-all duration-300 active:scale-95 shadow-2xl text-center"
          >
            Read the Story
          </Link>

          <a
            href="https://razorsports-backend.vercel.app/razorbill.apk"
            className="group flex items-center gap-3 font-mono text-[9px] text-lab-slate hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            <Download
              size={14}
              className="group-hover:animate-bounce text-lab-emerald"
            />
            Download APK
          </a>
        </div>
      </div>
    </section>
  );
}
