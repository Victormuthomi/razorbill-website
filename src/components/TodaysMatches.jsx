import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
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

  const [activeToastMatchId, setActiveToastMatchId] = useState(null);
  const notifyTimers = useRef({});

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sports
        let sportsData = JSON.parse(
          localStorage.getItem("sportsData") || "null",
        );
        if (!sportsData) {
          const sportsResponse = await fetch(`${BASE_URL}/api/sports`);
          if (!sportsResponse.ok) throw new Error("Failed to fetch sports.");
          sportsData = await sportsResponse.json();
          localStorage.setItem("sportsData", JSON.stringify(sportsData));
        }

        if (!mounted) return;

        const sportsMapLocal = {};
        sportsData.forEach((sport) => (sportsMapLocal[sport.id] = sport.name));
        setSportsMap(sportsMapLocal);

        // Fetch today's popular matches
        const res = await fetch(`${BASE_URL}/api/matches/today/popular`);
        if (!res.ok) throw new Error("Failed to fetch today matches.");
        const todayMatches = await res.json();

        // Group by sport
        const grouped = {};
        todayMatches.forEach((m) => {
          if (!grouped[m.category]) grouped[m.category] = [];
          grouped[m.category].push(m);
        });

        if (mounted) setMatchesBySport(grouped);
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

      setActiveToastMatchId(matchId);
      setTimeout(() => setActiveToastMatchId(null), 5000);

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

  const filteredSortedEntries = useMemo(() => {
    if (!matchesBySport) return [];

    const term = searchTerm.toLowerCase();
    const filtered = {};

    Object.entries(matchesBySport).forEach(([sportId, matches]) => {
      const f = matches.filter((m) => {
        const home = m.teams?.home?.name?.toLowerCase() || "";
        const away = m.teams?.away?.name?.toLowerCase() || "";
        return home.includes(term) || away.includes(term);
      });
      if (f.length) filtered[sportId] = f;
    });

    return Object.entries(filtered).sort(([a], [b]) => {
      const nameA = sportsMap[a]?.toLowerCase() || "";
      const nameB = sportsMap[b]?.toLowerCase() || "";
      if (nameA === "football") return -1;
      if (nameB === "football") return 1;
      return nameA.localeCompare(nameB);
    });
  }, [searchTerm, matchesBySport, sportsMap]);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading today's matches...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12 text-center">
      <div className="font-lora flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-yellow-400">
          Popular Matches Today
        </h2>
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-inter w-full sm:w-auto rounded-3xl border border-white/15 bg-transparent text-white px-4 py-2 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/5 transition duration-200"
        />
      </div>

      {filteredSortedEntries.length === 0 && (
        <p className="font-lora text-white">No popular matches today.</p>
      )}

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
                {activeToastMatchId === match.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded shadow z-50 text-sm">
                    ✅ Notification set! You will be notified 10 minutes before
                    kickoff.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={match.teams?.home?.badge}
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

                  <div className="flex flex-col items-center text-center">
                    <img
                      src={match.teams?.away?.badge}
                      alt={match.teams?.away?.name}
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                    />
                    <p className="font-lora text-white mt-2 text-sm sm:text-base">
                      {match.teams?.away?.name}
                    </p>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="text-white text-sm">
                    {new Date(match.date).toLocaleString()}
                  </p>

                  {match.sources?.length ? (
                    <div className="flex justify-center items-center mt-4 space-x-3">
                      <Link
                        to={`/matches/${match.id}`}
                        className="font-inter rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium px-6 py-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        Watch Now
                      </Link>

                      <button
                        onClick={() => handleNotify(match.id, match.date)}
                        disabled={isMatchNotified(match.id)}
                        className="font-inter ml-4 text-sm text-gray-300 px-6 py-3 rounded-full transition duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
