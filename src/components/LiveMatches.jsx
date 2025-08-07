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
          `${import.meta.env.VITE_API_BASE_URL}/api/matches/live/popular`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch live matches. Please try again later."
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
      <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-center text-yellow-400 mb-8">
        Live Popular Matches
      </h2>

      {matches.length === 0 ? (
        <p className="font-lora text-center text-white">
          No live matches at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-black/60 w-full sm:w-auto rounded-3xl border border-white/15 text-white px-4 py-2 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/5 transition duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                {/* Home Team */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src={`https://streamed.su/api/images/badge/${match.teams?.home?.badge}.webp`}
                    alt={match.teams?.home?.name}
                    className=" h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                  />
                  <p className="font-lora text-white mt-2 text-sm sm:text-base">
                    {match.teams?.home?.name}
                  </p>
                </div>

                <div className="font-playfair text-white font-bold text-lg">
                  VS
                </div>

                {/* Away Team */}
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

              <div className="text-center mt-4">
                <p className="font-lora text-white text-sm mb-2">
                  {new Date(match.date).toLocaleString()}
                </p>

                {match.sources && match.sources.length > 0 ? (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
