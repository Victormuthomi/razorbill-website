import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch(
          "https://streamed.su/api/matches/live/popular",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch live matches. Please try again later.",
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          throw new Error("Unexpected data format received.");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching live matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-10">
        Loading live matches...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-yellow-400 mb-8">
        Live Popular Matches
      </h2>

      {matches.length === 0 ? (
        <p className="text-center text-white">No live matches at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-black/60 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-yellow-400 hover:border"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                {/* Home Team */}
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

                <div className="text-white font-bold text-lg">VS</div>

                {/* Away Team */}
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
                <p className="text-white text-sm mb-2">
                  {new Date(match.date).toLocaleString()}
                </p>

                {match.sources && match.sources.length > 0 ? (
                  <Link
                    to={`/matches/${match.id}`}
                    className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm sm:text-base hover:bg-gray-200 transition duration-200"
                  >
                    Watch Now
                  </Link>
                ) : (
                  <p className="text-white text-sm">
                    No live stream available.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
