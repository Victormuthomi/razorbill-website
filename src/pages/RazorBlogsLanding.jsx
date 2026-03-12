import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_URL, AUTHOR_URL } from "../api";
import {
  Command,
  Terminal,
  Eye,
  ArrowUpRight,
  Cpu,
  BookOpen,
  Globe,
  Fingerprint,
} from "lucide-react";

export default function AlcodistArchive() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorCache, setAuthorCache] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(BLOG_URL);
        const data = await res.json();
        const formatted = await Promise.all(
          data.map(async (item) => {
            const authorId = item.blog?.author_id;
            let authorData = authorCache[authorId];
            if (!authorData && authorId) {
              const aRes = await fetch(`${AUTHOR_URL}/public/${authorId}`);
              const aJson = await aRes.json();
              authorData = aJson.author;
              setAuthorCache((prev) => ({ ...prev, [authorId]: authorData }));
            }
            return { ...item, author: authorData || { name: "Guest" } };
          })
        );

        // Sort by Readers (Most impactful insights first)
        setBlogs(
          formatted.sort(
            (a, b) => (b.blog?.readers || 0) - (a.blog?.readers || 0)
          )
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono text-blue-600 animate-pulse">
        ACCESSING_ARCHIVE_DATA...
      </div>
    );

  return (
    <main className="bg-[#020202] text-[#888] min-h-screen font-sans">
      {/* Structural Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Terminal size={20} />
            </div>
            <div>
              <h1 className="text-white font-bold tracking-tighter text-xl uppercase">
                Alcodist_Archive.
              </h1>
              <p className="text-[9px] font-mono text-blue-500 uppercase tracking-[0.3em]">
                Insights_&_Architecture
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest">
            <Link to="/" className="text-white">
              Index
            </Link>
            <a href="#case-studies" className="hover:text-white transition">
              Case_Studies
            </a>
            <Link
              to="/authors/login"
              className="px-4 py-2 border border-white/10 rounded-md hover:bg-white hover:text-black transition-all"
            >
              Portal_Access
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero: The Founder's Mission */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                Muthomi Victor // Lead Architect
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
              Documenting <br /> the{" "}
              <span className="text-blue-600">Build.</span>
            </h2>
            <p className="text-lg text-gray-400 font-light max-w-lg leading-relaxed mb-10">
              Technical retrospectives, startup logic, and system design
              patterns. This archive serves as the primary source of truth for
              the Alcodist ecosystem.
            </p>
            <div className="flex gap-10">
              <div>
                <p className="text-[10px] font-mono text-gray-600 uppercase mb-1">
                  Database
                </p>
                <p className="text-white font-mono text-sm">PostgreSQL_Node</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-600 uppercase mb-1">
                  Framework
                </p>
                <p className="text-white font-mono text-sm">NestJS_Core</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="relative border border-white/10 rounded-3xl bg-black/40 p-8 backdrop-blur-sm overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                <Cpu className="text-blue-500" size={32} />
                <div className="text-right">
                  <p className="text-[10px] font-mono text-gray-500 uppercase">
                    System_Build
                  </p>
                  <p className="text-xs text-white font-mono">v4.0.2_STABLE</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-blue-600 w-3/4"></div>
                </div>
                <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-blue-600 w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Master Feed */}
      <section
        id="case-studies"
        className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5"
      >
        <div className="flex justify-between items-end mb-16">
          <h3 className="text-white text-xs font-mono uppercase tracking-[0.5em]">
            Central_Registry
          </h3>
          <div className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">
            Sort: By_Influence
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {blogs.map((item, index) => (
            <Link
              key={item.blog.id}
              to={`/blogs/${item.blog.id}`}
              className="group flex flex-col md:flex-row justify-between items-center p-8 border border-white/5 rounded-2xl hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center flex-1">
                <span className="text-[10px] font-mono text-blue-900 group-hover:text-blue-500 transition-colors uppercase italic font-bold">
                  Log_0{index + 1}
                </span>
                <div className="max-w-xl">
                  <h4 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {item.blog.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-1 font-light">
                    {item.author.name} // {item.blog.category || "General"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-10 mt-6 md:mt-0">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-gray-700" />
                  <span className="text-[11px] font-mono text-gray-400">
                    {item.blog.readers || 0}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-600">
            <Link
              to="/authors/register"
              className="hover:text-white transition"
            >
              Register_Access
            </Link>
            <span>|</span>
            <a href="#" className="hover:text-white transition">
              Network_Status
            </a>
          </div>
          <p className="text-[10px] font-mono text-gray-800 uppercase tracking-[0.3em]">
            © 2026 ALCODIST_SYSTEMS. DESIGNED_BY_MUT_VIC.
          </p>
        </div>
      </footer>
    </main>
  );
}
