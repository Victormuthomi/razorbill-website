import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MatchDetails = () => {
  const { id } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [streams, setStreams] = useState([]);
  const [teamABadge, setTeamABadge] = useState(null);
  const [teamBBadge, setTeamBBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Extract teams from the match ID
  const getTeamsFromId = (matchId) => {
    const parts = matchId.split("-vs-");
    if (parts.length === 2) {
      const formatTeam = (team) =>
        team
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      return {
        teamA: formatTeam(parts[0]),
        teamB: formatTeam(parts[1]),
      };
    }
    return { teamA: "Team A", teamB: "Team B" };
  };

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const matchRes = await fetch(
          "https://streamed.su/api/matches/all/popular",
        );
        if (!matchRes.ok)
          throw new Error(`Failed to fetch: ${matchRes.statusText}`);
        const allMatches = await matchRes.json();

        const match = allMatches.find((match) => match.id === id);
        if (!match) {
          setError("Match not found.");
          setLoading(false);
          return;
        }

        setMatchDetails(match);

        // 🔑 Use the same API structure for fetching team badges
        const homeBadgeUrl = `https://streamed.su/api/images/badge/${match.teams?.home?.badge}.webp`;
        const awayBadgeUrl = `https://streamed.su/api/images/badge/${match.teams?.away?.badge}.webp`;

        setTeamABadge(homeBadgeUrl);
        setTeamBBadge(awayBadgeUrl);

        if (match.sources && match.sources.length > 0) {
          const streamPromises = match.sources.map(async (src) => {
            try {
              const res = await fetch(
                `https://streamed.su/api/stream/${src.source}/${src.id}`,
              );
              if (!res.ok) throw new Error(`Stream fetch failed`);
              return await res.json();
            } catch (err) {
              console.error(`Error fetching stream from ${src.source}:`, err);
              return null;
            }
          });

          const results = await Promise.all(streamPromises);
          const validStreams = results.filter(Boolean).flat();
          setStreams(validStreams);
        } else {
          setError("No sources found in match data.");
        }
      } catch (err) {
        setError("Error fetching match details or streams.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading match details...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  const { teamA, teamB } = getTeamsFromId(id);

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      {/* Removed Match Title */}
      <div className="flex justify-center gap-8 mb-8">
        {/* Team A */}
        <div className="flex items-center gap-2">
          {teamABadge && (
            <img
              src={teamABadge}
              alt={`${teamA} Badge`}
              className="h-12 w-auto"
            />
          )}
          <h3 className="text-white">{teamA}</h3>
        </div>

        {/* VS Text */}
        <div className="flex items-center justify-center text-white text-2xl">
          VS
        </div>

        {/* Team B */}
        <div className="flex items-center gap-2">
          {teamBBadge && (
            <img
              src={teamBBadge}
              alt={`${teamB} Badge`}
              className="h-12 w-auto"
            />
          )}
          <h3 className="text-white">{teamB}</h3>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-yellow-400 mb-8">
        Available Streams
      </h2>

      {streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {streams.map((stream, index) => (
            <div
              key={index}
              className="bg-black/60 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-400 hover:border-yellow-400 md:border-transparent md:hover:border-yellow-400"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">
                    Stream #{index + 1}
                  </h3>
                  <p className="text-sm sm:text-base">
                    <strong>Language:</strong> {stream.language}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>HD:</strong> {stream.hd ? "✅ Yes" : "❌ No"}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Source:</strong> {stream.source}
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <a
                  href={stream.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm sm:text-base hover:bg-gray-200 transition duration-200"
                >
                  🎥 Watch Stream
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">
          No streams available for this match.
        </p>
      )}
    </div>
  );
};

export default MatchDetails;
