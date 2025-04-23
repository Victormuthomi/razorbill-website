import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MatchDetails = () => {
  const { id } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [streams, setStreams] = useState([]);
  const [teamABadge, setTeamABadge] = useState(null);
  const [teamBBadge, setTeamBBadge] = useState(null);
  const [selectedStreamUrl, setSelectedStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

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
          if (validStreams.length > 0) {
            setSelectedStreamUrl(validStreams[0].embedUrl);
          }
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
      {/* Match Teams */}
      <div className="flex justify-center gap-8 mb-8">
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
        <div className="flex items-center justify-center text-white text-2xl">
          VS
        </div>
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

      {/* Live Match Player */}
      {selectedStreamUrl && (
        <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden border border-white">
          <iframe
            src={selectedStreamUrl}
            allow="fullscreen"
            title="Match Stream"
            className="w-full h-full"
          ></iframe>
        </div>
      )}

      {/* Yellow Ad Message */}
      <div className="text-yellow-400 text-center mb-4 text-sm sm:text-base">
        Note: If you're redirected or see popups, just close them and return
        here. Ads may appear. For a smoother experience, consider using an ad
        blocker like uBlock Origin.
      </div>

      {/* uBlock Help Button */}
      <div className="text-center mb-10">
        <button
          onClick={() => setShowVideo(true)}
          className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold transition duration-200"
        >
          Need help setting up uBlock? Click to watch tutorial
        </button>
      </div>

      {/* YouTube Help Video (Hidden until clicked) */}
      {showVideo && (
        <div className="aspect-w-16 aspect-h-9 mb-10 rounded-xl overflow-hidden border border-white">
          <iframe
            src="https://youtu.be/ijvlRpCOgfU?si=T0rduRPh-E8dHDbB"
            allow="fullscreen"
            title="uBlock Help Video"
            className="w-full h-full"
          ></iframe>
        </div>
      )}

      {/* Stream Options */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-yellow-400 mb-8">
        Available Streams
      </h2>

      {streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {streams.map((stream, index) => (
            <div
              key={index}
              className="bg-black/60 p-4 rounded-xl shadow-md transition-all duration-300 hover:border hover:border-yellow-400 cursor-pointer"
            >
              <div className="text-white mb-3">
                <h3 className="text-xl font-bold mb-2">Stream #{index + 1}</h3>
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
              <div className="text-center">
                <button
                  onClick={() => setSelectedStreamUrl(stream.embedUrl)}
                  className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  🎥 Watch Stream
                </button>
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
