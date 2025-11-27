import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../api";

// Match card (same structure as TodayMatches)
const MatchCard = React.memo(({ match }) => (
  <div
    key={match.id}
    className="bg-black/60 w-full sm:w-auto rounded-3xl border border-white/15 text-white px-4 py-2 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/5 transition duration-200"
  >
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
      {/* Home Team */}
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

      <div className="font-playfair text-white font-bold text-lg">VS</div>

      {/* Away Team */}
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
      <p className="font-lora text-white text-sm mb-2">
        {new Date(match.date).toLocaleString()}
      </p>

      {match.sources?.length > 0 ? (
        <Link
          to={`/matches/${match.id}`}
          className="font-inter inline-block rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium px-6 py-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Watch Now
        </Link>
      ) : (
        <p className="font-lora text-white text-sm">
          No live stream available.
        </p>
      )}
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

        // Fetch live matches
        const liveRes = await fetch(`${BASE_URL}/api/matches/live/popular`);
        if (!liveRes.ok) throw new Error("Failed to fetch live matches");
        const liveData = await liveRes.json();

        // Fetch today matches to get badges
        const todayRes = await fetch(`${BASE_URL}/api/matches/today/popular`);
        if (!todayRes.ok) throw new Error("Failed to fetch today matches");
        const todayData = await todayRes.json();

        // Build badge map exactly like TodayMatches
        const badgeMap = {};
        todayData.forEach((m) => {
          if (m.teams?.home?.badge)
            badgeMap[m.teams.home.name] = m.teams.home.badge;
          if (m.teams?.away?.badge)
            badgeMap[m.teams.away.name] = m.teams.away.badge;
        });

        // Merge badges into live matches
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
        if (mounted) setError(err.message || "Failed to fetch live matches");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMatches();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [matches]);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading live matches...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-center text-yellow-400 mb-8">
        Live Popular Matches
      </h2>

      {sortedMatches.length === 0 ? (
        <p className="font-lora text-center text-white">
          No live matches at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
