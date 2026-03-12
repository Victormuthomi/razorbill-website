import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, Radio, PlayCircle, Trophy, Zap, Clock } from "lucide-react";
import BASE_URL from "../api";

// MatchCard: Refactored for High-Density Intelligence
const MatchCard = React.memo(({ match }) => (
  <div className="group relative bg-obsidian-800/40 border border-lab-emerald/20 rounded-[2rem] p-6 transition-all duration-500 hover:bg-obsidian-700/60 hover:border-lab-emerald/50 backdrop-blur-xl">
    {/* Live Status Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lab-emerald opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-lab-emerald"></span>
        </span>
        <span className="font-mono text-[10px] font-bold text-lab-emerald uppercase tracking-[0.2em]">
          Live Stream Active
        </span>
      </div>
      {match.popular && (
        <Zap size={14} className="text-lab-cobalt fill-lab-cobalt/20" />
      )}
    </div>

    {/* Team Grid */}
    <div className="flex items-center justify-between gap-2 mb-10">
      <div className="flex-1 flex flex-col items-center gap-3">
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          <img
            src={match.teams?.home?.badge}
            alt=""
            className="w-16 h-16 rounded-full bg-black/40 p-2 object-contain border border-white/5"
          />
          <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        </div>
        <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight h-8">
          {match.teams?.home?.name}
        </span>
      </div>

      <div className="flex flex-col items-center px-2">
        <span className="font-mono text-[10px] text-lab-slate opacity-30 italic font-black">
          VS
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center gap-3">
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          <img
            src={match.teams?.away?.badge}
            alt=""
            className="w-16 h-16 rounded-full bg-black/40 p-2 object-contain border border-white/5"
          />
          <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        </div>
        <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight h-8">
          {match.teams?.away?.name}
        </span>
      </div>
    </div>

    {/* Action Footer */}
    <div className="pt-6 border-t border-white/5">
      <Link
        to={`/matches/${match.id}`}
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-lab-emerald text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-lg shadow-lab-emerald/10"
      >
        <PlayCircle size={16} /> Enter Theatre Mode
      </Link>
    </div>
  </div>
));

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // Senior Move: Parallel Fetching for speed
        const [liveRes, todayRes] = await Promise.all([
          fetch(`${BASE_URL}/api/matches/live/popular`),
          fetch(`${BASE_URL}/api/matches/today/popular`),
        ]);

        if (!liveRes.ok || !todayRes.ok)
          throw new Error("Synchronization Error");

        const liveData = await liveRes.json();
        const todayData = await todayRes.json();

        const badgeMap = {};
        todayData.forEach((m) => {
          if (m.teams?.home?.badge)
            badgeMap[m.teams.home.name] = m.teams.home.badge;
          if (m.teams?.away?.badge)
            badgeMap[m.teams.away.name] = m.teams.away.badge;
        });

        const mergedMatches = liveData.map((m) => ({
          ...m,
          teams: {
            home: {
              ...m.teams?.home,
              badge: badgeMap[m.teams?.home?.name] || m.teams?.home?.badge,
            },
            away: {
              ...m.teams?.away,
              badge: badgeMap[m.teams?.away?.name] || m.teams?.away?.badge,
            },
          },
        }));

        if (mounted) setMatches(mergedMatches);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMatches();
    // Refresh every 60 seconds to keep the "Live" feel
    const interval = setInterval(fetchMatches, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) =>
      a.popular === b.popular ? 0 : a.popular ? -1 : 1
    );
  }, [matches]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <Radio className="text-lab-emerald animate-pulse" size={48} />
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-lab-slate">
          Scanning Satellite Uplinks...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header Telemetry */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lab-emerald/30 bg-lab-emerald/5 text-lab-emerald text-[10px] font-mono uppercase tracking-[0.2em]">
          <Activity size={12} /> Live Transmission
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
          Global<span className="text-lab-emerald">.Live</span>
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {sortedMatches.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-white/5 rounded-[3rem]">
          <p className="font-mono text-xs text-lab-slate uppercase tracking-widest opacity-40 italic">
            No Active Uplinks Detected
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
