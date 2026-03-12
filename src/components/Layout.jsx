import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import {
  Home,
  Trophy,
  Film,
  MessageSquare,
  BookOpen,
  Activity,
  Zap,
} from "lucide-react";

const Layout = () => {
  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/matches", icon: <Trophy size={20} />, label: "Sports" },
    { path: "/movies", icon: <Film size={20} />, label: "Movies" },
    { path: "/about", icon: <MessageSquare size={20} />, label: "About" },
    { path: "/blogs", icon: <BookOpen size={20} />, label: "Logs" },
  ];

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-200 selection:bg-lab-emerald/30 font-sans">
      {/* 1. Global Technical Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,rgba(5,5,5,1)_75%)]" />

      {/* 2. Desktop Sidebar - The Professional Interface */}
      <aside className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-white/5 bg-obsidian-800/40 py-8 backdrop-blur-2xl md:flex z-50">
        <Link to="/" className="mb-12 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lab-emerald to-emerald-900 text-white font-bold shadow-lg shadow-lab-emerald/20 transition-transform group-hover:scale-110">
            A
          </div>
        </Link>
        <nav className="flex flex-col gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative transition-all duration-300 hover:text-lab-emerald ${
                  isActive ? "text-lab-emerald scale-110" : "text-lab-slate"
                }`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 3. Main Stage */}
      <div className="relative z-10 flex flex-col min-h-screen md:pl-20">
        {/* Top Branding Bar */}
        <header className="flex h-16 items-center justify-between px-6 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab-slate">
              Alcodist
            </span>
            <span className="h-1 w-1 rounded-full bg-lab-emerald animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white">
              Hub
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-lab-slate uppercase tracking-widest">
            <span className="hidden sm:inline">v3.1.0_stable</span>
            <div className="h-8 w-8 rounded-lg bg-obsidian-700 border border-white/10 flex items-center justify-center text-white">
              V
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow p-4 md:p-8 pb-32 md:pb-8">
          <Outlet />
        </main>

        {/* Minimalist Professional Disclaimer */}
        <footer className="px-8 py-6 border-t border-white/5 bg-obsidian-900/50">
          <div className="max-w-4xl opacity-40 hover:opacity-100 transition-opacity">
            <p className="font-mono text-[9px] leading-relaxed uppercase tracking-wider">
              [SYSTEM NOTE]: Distributed metadata gateway. No local storage of
              assets. &copy; {new Date().getFullYear()} ALCODIST_LABS_RND.
            </p>
          </div>
        </footer>
      </div>

      {/* 4. Floating Mobile App-Nav (The Mobile "Wow") */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-14 w-[90%] max-w-sm items-center justify-around rounded-full border border-white/10 bg-obsidian-800/80 shadow-2xl backdrop-blur-2xl md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-2 transition-all duration-300 ${
                isActive ? "text-lab-emerald" : "text-lab-slate"
              }`
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
