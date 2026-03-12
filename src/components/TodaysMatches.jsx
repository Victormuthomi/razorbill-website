import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Bell,
  BellRing,
  PlayCircle,
  Search,
  Activity,
  Clock,
} from "lucide-react";
import notifySound from "../assets/notify.mp3";
import BASE_URL from "../api";

const TodayMatches = () => {
  const [matchesBySport, setMatchesBySport] = useState({});
  const [sportsMap, setSportsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notified, setNotified] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifiedMatches") || "[]");
    } catch {
      return [];
    }
  });

  const notifyTimers = useRef({});

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sportsRes, matchesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/sports`),
          fetch(`${BASE_URL}/api/matches/today/popular`),
        ]);

        if (!sportsRes.ok || !matchesRes.ok)
          throw new Error("Data Sync Failed.");

        const sportsData = await sportsRes.json();
        const todayMatches = await matchesRes.json();

        if (!mounted) return;

        const sMap = {};
        sportsData.forEach((s) => (sMap[s.id] = s.name));
        setSportsMap(sMap);

        // Grouping and Sorting by Time (Earliest First)
        const grouped = todayMatches.reduce((acc, m) => {
          const cat = m.category || "other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(m);
          return acc;
        }, {});

        // Internal Sort for each category
        Object.keys(grouped).forEach((cat) => {
          grouped[cat].sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        setMatchesBySport(grouped);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
      Object.values(notifyTimers.current).forEach(clearTimeout);
    };
  }, []);

  const handleNotify = useCallback(
    (matchId, matchTime) => {
      if (notified.includes(matchId)) return;
      const updated = [...notified, matchId];
      setNotified(updated);
      localStorage.setItem("notifiedMatches", JSON.stringify(updated));

      const notifyAt = new Date(matchTime).getTime() - 10 * 60 * 1000;
      const delay = notifyAt - Date.now();

      notifyTimers.current[matchId] = setTimeout(
        () => {
          new Audio(notifySound).play().catch(() => {});
        },
        delay > 0 ? delay : 1000
      );
    },
    [notified]
  );

  const filteredEntries = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Object.entries(matchesBySport)
      .map(([id, matches]) => [
        id,
        matches.filter(
          (m) =>
            m.teams?.home?.name?.toLowerCase().includes(term) ||
            m.teams?.away?.name?.toLowerCase().includes(term)
        ),
      ])
      .filter(([_, matches]) => matches.length > 0)
      .sort(([a], [b]) => {
        const nameA = sportsMap[a] || "";
        return nameA.toLowerCase() === "football" ? -1 : 1;
      });
  }, [searchTerm, matchesBySport, sportsMap]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative">
          <Activity className="text-lab-emerald animate-pulse" size={48} />
          <div className="absolute inset-0 bg-lab-emerald/20 blur-xl animate-pulse" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab-slate mt-6">
          Indexing Schedule...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lab-emerald font-mono text-[10px] uppercase tracking-widest">
            <Clock size={14} /> System Time:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
            Match<span className="text-lab-emerald">.Schedule</span>
          </h2>
        </div>

        <div className="relative group w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-lab-slate group-focus-within:text-lab-emerald transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="SCAN BY TEAM IDENTITY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-obsidian-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono text-white placeholder:text-lab-slate/40 focus:outline-none focus:border-lab-emerald/40 transition-all backdrop-blur-xl"
          />
        </div>
      </div>

      {/* Sport Streams */}
      {filteredEntries.map(([sportId, matches]) => (
        <section key={sportId} className="space-y-8">
          <div className="flex items-center gap-6">
            <span className="flex-none bg-white/5 px-4 py-1 rounded-full border border-white/5 font-mono text-[10px] text-white uppercase tracking-widest">
              {sportsMap[sportId] || "Other"}
            </span>
            <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="group relative bg-obsidian-800/20 border border-white/5 rounded-[2rem] p-6 hover:bg-obsidian-800/60 transition-all duration-500 hover:border-white/10"
              >
                {/* Time Tag */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 text-lab-emerald">
                    <div className="h-1.5 w-1.5 rounded-full bg-lab-emerald animate-pulse" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">
                      {new Date(match.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNotify(match.id, match.date)}
                    className={`p-2 rounded-xl transition-all ${
                      notified.includes(match.id)
                        ? "bg-lab-emerald/10 text-lab-emerald"
                        : "bg-white/5 text-lab-slate hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {notified.includes(match.id) ? (
                      <BellRing size={16} />
                    ) : (
                      <Bell size={16} />
                    )}
                  </button>
                </div>

                {/* Match Identity */}
                <div className="flex items-center justify-between gap-2 mb-10">
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative">
                      <img
                        src={match.teams?.home?.badge}
                        alt=""
                        className="w-14 h-14 rounded-full bg-black/40 p-2 object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute inset-0 rounded-full border border-white/5" />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight h-8">
                      {match.teams?.home?.name}
                    </span>
                  </div>

                  <div className="flex-none px-3">
                    <span className="font-mono text-[9px] text-lab-slate opacity-20 italic font-bold">
                      VS
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative">
                      <img
                        src={match.teams?.away?.badge}
                        alt=""
                        className="w-14 h-14 rounded-full bg-black/40 p-2 object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute inset-0 rounded-full border border-white/5" />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight h-8">
                      {match.teams?.away?.name}
                    </span>
                  </div>
                </div>

                {/* Dynamic Footer */}
                <div className="pt-6 border-t border-white/5">
                  {match.sources?.length ? (
                    <Link
                      to={`/matches/${match.id}`}
                      className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-lab-emerald hover:text-white transition-all shadow-lg hover:shadow-lab-emerald/20"
                    >
                      <PlayCircle size={14} /> Open Stream
                    </Link>
                  ) : (
                    <div className="text-center py-3 text-[9px] font-mono text-lab-slate uppercase tracking-widest opacity-40 italic">
                      Uplink Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TodayMatches;
