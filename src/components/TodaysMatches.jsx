import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import notifySound from "../assets/notify.mp3";

const TodayMatches = () => {
  const [matchesBySport, setMatchesBySport] = useState({});
  const [sportsMap, setSportsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [notified, setNotified] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifiedMatches")) || [];
    } catch {
      return [];
    }
  });

  const [activeToastMatchId, setActiveToastMatchId] = useState(null);
  const notifyTimers = useRef({}); // prevent timers from stacking

  /** ------------------------------------------------------------------
   * Fetch Sports + Today Matches
   * ------------------------------------------------------------------*/
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        /** Get sports from cache or API */
        let sportsData = JSON.parse(
          localStorage.getItem("sportsData") || "null",
        );
        if (!sportsData) {
          const sportsResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/sports`,
          );
          if (!sportsResponse.ok) throw new Error("Failed to fetch sports.");
          sportsData = await sportsResponse.json();
          localStorage.setItem("sportsData", JSON.stringify(sportsData));
        }

        if (!mounted) return;

        const sportsMapLocal = {};
        sportsData.forEach((sport) => (sportsMapLocal[sport.id] = sport.name));
        setSportsMap(sportsMapLocal);

        /** Fetch per-sport matches */
        const results = {};
        const todayString = new Date().toDateString();

        await Promise.all(
          sportsData.map(async (sport) => {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/matches/${sport.id}/popular`,
            );
            if (!res.ok) return;

            const data = await res.json();
            const todayMatches = data.filter((m) => {
              return new Date(m.date).toDateString() === todayString;
            });

            if (todayMatches.length > 0) results[sport.id] = todayMatches;
          }),
        );

        if (mounted) setMatchesBySport(results);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;

      // Clear scheduled timers
      Object.values(notifyTimers.current).forEach(clearTimeout);
    };
  }, []);

  /** ------------------------------------------------------------------
   * Trigger Notification
   * ------------------------------------------------------------------*/
  const handleNotify = useCallback(
    (matchId, matchTime) => {
      // Prevent duplicate
      if (notified.includes(matchId)) return;

      const updated = [...notified, matchId];
      setNotified(updated);
      localStorage.setItem("notifiedMatches", JSON.stringify(updated));

      setActiveToastMatchId(matchId);

      setTimeout(() => setActiveToastMatchId(null), 5000);

      // Calculate 10min-before notification
      const notifyAt = new Date(matchTime).getTime() - 10 * 60 * 1000;
      const delay = notifyAt - Date.now();

      notifyTimers.current[matchId] = setTimeout(
        () => {
          try {
            new Audio(notifySound).play().catch(() => {});
          } catch {}
          alert("📢 Match starting soon!");
        },
        delay > 0 ? delay : 1000,
      );
    },
    [notified],
  );

  const isMatchNotified = useCallback(
    (id) => notified.includes(id),
    [notified],
  );

  /** ------------------------------------------------------------------
   * Filter and Sort
   * ------------------------------------------------------------------*/
  const filteredSortedEntries = useMemo(() => {
    if (!matchesBySport) return [];

    const term = searchTerm.toLowerCase();

    const filtered = Object.entries(matchesBySport).reduce(
      (acc, [sportId, matches]) => {
        const f = matches.filter((m) => {
          const home = m.teams?.home?.name?.toLowerCase() || "";
          const away = m.teams?.away?.name?.toLowerCase() || "";
          return home.includes(term) || away.includes(term);
        });

        if (f.length) acc[sportId] = f;
        return acc;
      },
      {},
    );

    return Object.entries(filtered).sort(([a], [b]) => {
      const nameA = sportsMap[a]?.toLowerCase() || "";
      const nameB = sportsMap[b]?.toLowerCase() || "";

      if (nameA === "football") return -1;
      if (nameB === "football") return 1;
      return nameA.localeCompare(nameB);
    });
  }, [searchTerm, matchesBySport, sportsMap]);

  /** ------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------*/
  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading today&apos;s matches...
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12 text-center">
      {/* Top Bar */}
      <div className="font-lora flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 text-center">
        <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-yellow-400">
          Popular Matches Today
        </h2>

        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-inter w-full sm:w-auto rounded-3xl border border-white/15 bg-transparent text-white px-4 py-2 
                     focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/5 transition duration-200"
        />
      </div>

      {/* No results */}
      {filteredSortedEntries.length === 0 && (
        <p className="font-lora text-center text-white">
          No popular matches today.
        </p>
      )}

      {/* MAIN LIST */}
      {filteredSortedEntries.map(([sportId, matches]) => (
        <div key={sportId} className="mb-10">
          <h3 className="font-lora text-xl sm:text-2xl text-white mb-4 font-semibold">
            {sportsMap[sportId] || "Other"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="relative rounded-xl border border-white/15 bg-black/60 shadow-md p-6"
              >
                {/* Toast */}
                {activeToastMatchId === match.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded shadow z-50 text-sm">
                    ✅ Notification set! You will be notified 10 minutes before
                    kickoff.
                  </div>
                )}

                {/* Teams */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Home */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={`https://streamed.su/api/images/badge/${match.teams?.home?.badge}.webp`}
                      alt={match.teams?.home?.name}
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                    />
                    <p className="font-lora text-white mt-2 text-sm sm:text-base">
                      {match.teams?.home?.name}
                    </p>
                  </div>

                  <div className="font-playfair text-white text-lg font-bold">
                    VS
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={`https://streamed.su/api/images/badge/${match.teams?.away?.badge}.webp`}
                      alt={match.teams?.away?.name}
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                    />
                    <p className="font-lora text-white mt-2 text-sm sm:text-base">
                      {match.teams?.away?.name}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="text-white text-sm">
                    {new Date(match.date).toLocaleString()}
                  </p>

                  {match.sources?.length ? (
                    <div className="flex justify-center items-center mt-4 space-x-3">
                      <Link
                        to={`/matches/${match.id}`}
                        className="font-inter rounded-full bg-white/10 hover:bg-white hover:text-black 
                                   focus:bg-white focus:text-black text-white font-medium px-6 py-3 
                                   transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        Watch Now
                      </Link>

                      <button
                        onClick={() => handleNotify(match.id, match.date)}
                        disabled={isMatchNotified(match.id)}
                        className="font-inter ml-4 text-sm text-gray-300 px-6 py-3 rounded-full 
                                   transition duration-200 hover:bg-white/10 hover:text-white 
                                   focus:bg-white/10 focus:text-white focus:outline-none 
                                   focus:ring-2 focus:ring-yellow-400"
                      >
                        {isMatchNotified(match.id) ? "Notified" : "Notify Me"}
                      </button>
                    </div>
                  ) : (
                    <p className="font-lora mt-2 text-white text-sm">
                      No live stream available.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodayMatches;
