import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Monitor,
  Globe,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Play,
  Info,
} from "lucide-react";
import BASE_URL from "../api";

const MatchDetails = () => {
  const { id } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMatches, setRelatedMatches] = useState([]);

  const fetchMatchDetails = useCallback(async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/matches/${id}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Link Severed.");
      const match = await res.json();
      if (!match?.id) {
        setError("Match Offline.");
        setLoading(false);
        return;
      }

      setMatchDetails(match);

      if (match.sources?.length > 0) {
        const results = await Promise.all(
          match.sources.map(async (src) => {
            try {
              const r = await fetch(
                `${BASE_URL}/api/streams/${src.source}/${src.id}`
              );
              return r.ok ? await r.json() : null;
            } catch {
              return null;
            }
          })
        );
        const valid = results
          .filter((r) => Array.isArray(r))
          .flat()
          .filter((s) => s?.embedUrl);
        setStreams(valid);
        if (valid.length > 0) setSelectedStreamIndex(0);
      }
    } catch (err) {
      if (err.name !== "AbortError") setError("Stream Sync Failed.");
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  // Sidebar Logic
  useEffect(() => {
    if (!matchDetails) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/matches/live/popular`);
        const data = await res.json();
        const related = data
          .filter(
            (m) =>
              m.category === matchDetails.category && m.id !== matchDetails.id
          )
          .slice(0, 6);
        setRelatedMatches(related);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [matchDetails]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Zap className="text-lab-emerald animate-pulse" size={40} />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab-slate">
          Establishing Uplink...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-obsidian-950 text-white pb-20">
      {/* Top Navigation */}
      <nav className="p-6">
        <Link
          to="/matches"
          className="inline-flex items-center gap-2 text-lab-slate hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Return to Hub
        </Link>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* LEFT: PLAYER & CONTROLS */}
          <div className="flex-grow space-y-8">
            {/* The Stage */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-lab-emerald/20 to-lab-cobalt/20 blur opacity-25" />
              <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                {streams.length > 0 ? (
                  <iframe
                    src={streams[selectedStreamIndex]?.embedUrl}
                    allowFullScreen
                    className="w-full h-full"
                    title="Alcodist Stream"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-lab-slate space-y-4">
                    <Info size={40} className="opacity-20" />
                    <p className="font-mono text-xs uppercase tracking-widest opacity-40">
                      No Signal Detected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Match Info Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">
                    {matchDetails?.teams?.home?.name}
                  </h3>
                </div>
                <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-lab-emerald">
                  VS
                </div>
                <div className="text-left">
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">
                    {matchDetails?.teams?.away?.name}
                  </h3>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-lab-slate uppercase tracking-widest">
                    Broadcast Quality
                  </span>
                  <span className="text-xs font-bold text-lab-emerald">
                    HD 1080p / 60FPS
                  </span>
                </div>
              </div>
            </div>

            {/* Stream Selection Tabs */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] text-lab-slate uppercase tracking-[0.3em]">
                Available Frequencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {streams.map((stream, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStreamIndex(index)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      selectedStreamIndex === index
                        ? "bg-white text-black border-white"
                        : "bg-obsidian-900/50 border-white/5 text-lab-slate hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedStreamIndex === index
                            ? "bg-black/10"
                            : "bg-white/5"
                        }`}
                      >
                        <Play
                          size={14}
                          fill={
                            selectedStreamIndex === index ? "black" : "none"
                          }
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-tighter leading-none">
                          Stream #{index + 1}
                        </p>
                        <p className="text-[9px] font-mono opacity-60 uppercase">
                          {stream.language} • {stream.source}
                        </p>
                      </div>
                    </div>
                    {stream.hd && (
                      <ShieldCheck
                        size={14}
                        className={
                          selectedStreamIndex === index
                            ? "text-black"
                            : "text-lab-emerald"
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: SECONDARY FEED (Related) */}
          <div className="xl:w-[380px] space-y-6">
            <div className="bg-obsidian-900/40 border border-white/5 rounded-[2rem] p-6">
              <h3 className="font-mono text-[10px] text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Monitor size={14} /> Global Feed
              </h3>
              <div className="space-y-3">
                {relatedMatches.map((m) => (
                  <Link
                    key={m.id}
                    to={`/matches/${m.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white uppercase group-hover:text-lab-emerald transition-colors">
                        {m.teams?.home?.name}{" "}
                        <span className="opacity-20 mx-1 italic text-[8px]">
                          vs
                        </span>{" "}
                        {m.teams?.away?.name}
                      </p>
                      <p className="text-[8px] font-mono text-lab-slate uppercase tracking-widest">
                        {new Date(m.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-lab-emerald animate-pulse" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Lab Meta Card */}
            <div className="p-6 rounded-[2rem] border border-lab-cobalt/20 bg-lab-cobalt/5">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={14} className="text-lab-cobalt" />
                <span className="text-[10px] font-mono text-white uppercase font-bold tracking-tighter">
                  Satellite Optimization
                </span>
              </div>
              <p className="text-[9px] text-lab-slate leading-relaxed font-mono">
                Alcodist Hub automatically routes your connection through the
                fastest local node for reduced latency in Meru and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
