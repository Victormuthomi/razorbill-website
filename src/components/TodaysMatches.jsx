import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TodayMatches = () => {
  const [matchesBySport, setMatchesBySport] = useState({});
  const [sportsMap, setSportsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSportsAndMatches = async () => {
      try {
        let sportsData = JSON.parse(localStorage.getItem("sportsData"));
        if (!sportsData) {
          const sportsResponse = await fetch("https://streamed.su/api/sports");
          if (!sportsResponse.ok) throw new Error("Failed to fetch sports.");
          sportsData = await sportsResponse.json();
          localStorage.setItem("sportsData", JSON.stringify(sportsData));
        }

        const sportsMap = {};
        sportsData.forEach((sport) => {
          sportsMap[sport.id] = sport.name;
        });
        setSportsMap(sportsMap);

        const matchesBySport = {};
        await Promise.all(
          sportsData.map(async (sport) => {
            const response = await fetch(
              `https://streamed.su/api/matches/${sport.id}/popular`,
            );
            if (response.ok) {
              const data = await response.json();
              const today = new Date();
              const todayMatches = data.filter((match) => {
                const matchDate = new Date(match.date);
                return (
                  matchDate.getDate() === today.getDate() &&
                  matchDate.getMonth() === today.getMonth() &&
                  matchDate.getFullYear() === today.getFullYear()
                );
              });
              if (todayMatches.length > 0) {
                matchesBySport[sport.id] = todayMatches;
              }
            }
          }),
        );

        setMatchesBySport(matchesBySport);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsAndMatches();
  }, []);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading today's matches...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  // Custom sorting function: Football first, then others alphabetically
  const sortedEntries = Object.entries(matchesBySport).sort(([aId], [bId]) => {
    const aName = sportsMap[aId]?.toLowerCase() || "";
    const bName = sportsMap[bId]?.toLowerCase() || "";

    // Prioritize "Football" at the top, then others in alphabetical order
    if (aName === "football") return -1;
    if (bName === "football") return 1;

    return aName.localeCompare(bName);
  });

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-white mb-8">
        Popular Matches Today
      </h2>

      {sortedEntries.length === 0 ? (
        <p className="text-center text-white">No popular matches today.</p>
      ) : (
        sortedEntries.map(([sportId, matches]) => (
          <div key={sportId} className="mb-10">
            <h3 className="text-xl sm:text-2xl text-white mb-4 font-semibold">
              {sportsMap[sportId] || "Other"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-black/60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:border-white hover:border"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={`https://streamed.su/api/images/badge/${match.teams?.home?.badge}.webp`}
                        alt={match.teams?.home?.name}
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                      />
                      <p className="text-white mt-2 text-sm sm:text-base">
                        {match.teams?.home?.name}
                      </p>
                    </div>

                    <div className="text-white text-lg font-bold">VS</div>

                    <div className="flex flex-col items-center text-center">
                      <img
                        src={`https://streamed.su/api/images/badge/${match.teams?.away?.badge}.webp`}
                        alt={match.teams?.away?.name}
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                      />
                      <p className="text-white mt-2 text-sm sm:text-base">
                        {match.teams?.away?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-white text-sm">
                      {new Date(match.date).toLocaleString()}
                    </p>
                    {match.sources && match.sources.length > 0 ? (
                      <Link
                        to={`/matches/${match.id}`} // Update to point to local match details page
                        className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-full text-sm sm:text-base hover:bg-gray-200 transition duration-200"
                      >
                        Watch Now
                      </Link>
                    ) : (
                      <p className="mt-2 text-white text-sm">
                        No live stream available.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayMatches;
