import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Code2,
  Share2,
  Shield,
  Fingerprint,
  Sparkles,
  Activity,
  ArrowUpRight,
  Github,
  Trophy,
  Film,
  BookOpen,
} from "lucide-react";

const Principle = ({ icon: Icon, title, body }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative p-10 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2.5rem] group hover:border-lab-emerald/20 transition-all duration-700"
  >
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 group-hover:text-lab-emerald transition-all duration-700">
      <Icon size={80} strokeWidth={1} />
    </div>
    <Icon
      className="text-lab-emerald mb-8 group-hover:scale-110 transition-transform duration-500"
      size={28}
    />
    <h3 className="font-mono text-[11px] uppercase tracking-[0.5em] text-white mb-6 italic">
      {title}
    </h3>
    <p className="text-lab-slate text-sm leading-relaxed font-light tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">
      {body}
    </p>
  </motion.div>
);

export default function AlcodistHub() {
  return (
    /* Updated wrapper: 
       - lg:ml-64 ensures it doesn't overlap your sidebar.
       - Removed absolute/fixed bg-black to let the Layout's footer show.
    */
    <div className="flex-1 min-h-screen text-white selection:bg-lab-emerald selection:text-black">
      {/* --- SECTION 1: THE EMPATHY LEAD --- */}
      <section className="relative px-6 lg:px-12 pt-40 pb-32 overflow-hidden">
        {/* Glow effect contained within section */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lab-emerald/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 text-lab-emerald font-mono text-[10px] uppercase tracking-[0.7em] mb-12"
          >
            <Heart size={14} className="fill-lab-emerald" /> Human-Centric
            Systems
          </motion.div>

          <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-16">
            Built with <br /> <span className="text-lab-emerald">Empathy.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <p className="text-xl md:text-3xl text-lab-slate font-light italic leading-snug">
              "The Alcodist Hub is a gift to the community—a decentralized home
              for high-fidelity sports, cinema, and technical writing. No
              paywalls, no tracking, just pure engineering."
            </p>
            <div className="flex flex-col gap-4 border-l border-white/10 pl-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-lab-emerald font-bold">
                Project Status: Fully Open Source
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">
                Cinema // Sports // Documentation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE ECOSYSTEM --- */}
      <section className="px-6 lg:px-12 py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Trophy,
              name: "Sports Streaming",
              desc: "Live-action indexing with zero-latency protocols.",
            },
            {
              icon: Film,
              name: "Cinema & Series",
              desc: "A high-fidelity archive of the world's greatest stories.",
            },
            {
              icon: BookOpen,
              name: "Technical Blogs",
              desc: "Lessons from the lab, shared for the next generation.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-lab-emerald transition-all duration-500">
                <item.icon size={24} className="text-lab-emerald" />
              </div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.5em] mb-4">
                {item.name}
              </h3>
              <p className="text-lab-slate text-[10px] uppercase tracking-widest opacity-60 leading-relaxed italic">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: THE CODE OF ETHICS --- */}
      <section className="px-6 lg:px-12 py-32 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white/90">
              Alcodist <br /> <span className="text-white/30">Principles</span>
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-lab-slate opacity-60 italic underline decoration-lab-emerald decoration-2 underline-offset-8">
              Lessons from the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Principle
              icon={Share2}
              title="Radical Generosity"
              body="Everything here is free. We believe software is at its best when it serves the many, not the few."
            />
            <Principle
              icon={Fingerprint}
              title="The Self-Taught Path"
              body="Proof that curiosity is the best curriculum. I built this to show that self-taught engineers can deliver elite, high-fidelity systems."
            />
            <Principle
              icon={Code2}
              title="Engineering Pride"
              body="We don't settle for 'good enough'. This hub is built with defensive testing and clean, microservices-driven architecture."
            />
            <Principle
              icon={Shield}
              title="Privacy by Default"
              body="The Alcodist Hub respects your sovereignty. No ads, no data mining, just the experience."
            />
            <Principle
              icon={Sparkles}
              title="Lessons from MO-jobs"
              body="Startups may fail, but engineering persists. This project carries the technical DNA of every failure and success before it."
            />
            <Principle
              icon={Activity}
              title="Constant Evolution"
              body="A living project. This hub adapts and grows with the community it serves—always refining, always pushing."
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE FOUNDER'S MARK --- */}
      <section className="px-6 lg:px-12 py-40 bg-gradient-to-t from-lab-emerald/[0.03] to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-px h-32 bg-gradient-to-b from-transparent via-lab-emerald to-transparent mx-auto mb-16" />

          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-12 leading-tight">
            "Engineering is the bridge between <br />
            <span className="text-lab-emerald">
              concern for others
            </span> and{" "}
            <span className="text-lab-emerald whitespace-nowrap">
              creative freedom
            </span>
            ."
          </h2>

          <div className="flex flex-col items-center gap-2 mb-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.8em] text-white/80">
              Muthomi Victor // Systems Architect
            </p>
            <div className="flex items-center gap-6 mt-6 opacity-40">
              <div className="h-px w-12 bg-white/20" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em]">
                Self-Taught & Startup Minded
              </span>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://muthomivictor.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-6 px-12 py-6 border border-white/10 rounded-2xl font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700 shadow-2xl"
            >
              The Portfolio
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
              />
            </a>

            <a
              href="https://github.com/Victormuthomi"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-6 px-12 py-6 bg-lab-emerald text-black font-black font-mono text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:shadow-[0_20px_50px_rgba(52,211,153,0.3)] transition-all duration-500 active:scale-95"
            >
              Explore The Source
              <Github
                size={16}
                className="group-hover:rotate-12 transition-transform duration-500"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Internal Page Footer */}
      <footer className="py-20 text-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <div className="flex justify-center items-center gap-4">
          <Activity size={16} className="text-lab-emerald" />
          <span className="font-mono text-[10px] uppercase tracking-[0.8em]">
            Alcodist Hub // 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
