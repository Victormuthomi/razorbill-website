import React, { useEffect, useState, useRef, useCallback } from "react";
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

  const iframeRef = useRef(null);
  const preloadRef = useRef(null);

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

  const fetchMatchDetails = useCallback(async () => {
    try {
      const matchRes = await fetch(
        "https://razorbill-backend.onrender.com/api/matches/all/popular",
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

      const homeBadgeUrl = `https://razorbill-backend.onrender.com/api/images/badge/${match.teams?.home?.badge}.webp`;
      const awayBadgeUrl = `https://razorbill-backend.onrender.com/api/images/badge/${match.teams?.away?.badge}.webp`;

      setTeamABadge(homeBadgeUrl);
      setTeamBBadge(awayBadgeUrl);

      if (match.sources && match.sources.length > 0) {
        const streamPromises = match.sources.map(async (src) => {
          try {
            const res = await fetch(
              `https://razorbill-backend.onrender.com/api/stream/${src.source}/${src.id}`,
            );
            if (!res.ok) throw new Error("Stream fetch failed");
            return await res.json();
          } catch (err) {
            console.error(`Error fetching stream from ${src.source}:`, err);
            return null;
          }
        });

        const results = await Promise.all(streamPromises);
        const validStreams = results
          .filter((r) => Array.isArray(r))
          .flat()
          .filter((s) => s?.embedUrl);

        setStreams(validStreams);

        if (validStreams.length > 0) {
          setTimeout(() => {
            setSelectedStreamUrl(validStreams[0].embedUrl);
          }, 300);
        }
      } else {
        setError("No sources found in match data.");
      }
    } catch (err) {
      setError("Error fetching match details or streams.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatchDetails();
  }, [id, fetchMatchDetails]);

  const handleStreamSelection = (streamUrl) => {
    setSelectedStreamUrl(streamUrl);
    if (preloadRef.current) {
      preloadRef.current.src = streamUrl;
    }
  };

  const { teamA, teamB } = getTeamsFromId(id);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading match details...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      <div className="flex justify-center gap-8 mb-8 items-center">
        <div className="flex items-center gap-2">
          {teamABadge && (
            <img src={teamABadge} alt={teamA} className="h-12 w-auto" />
          )}
          <h3 className="font-lora text-white text-lg sm:text-xl">{teamA}</h3>
        </div>
        <div className="text-white text-2xl font-playfair">VS</div>
        <div className="flex items-center gap-2">
          {teamBBadge && (
            <img src={teamBBadge} alt={teamB} className="h-12 w-auto" />
          )}
          <h3 className="font-lora text-white text-lg sm:text-xl">{teamB}</h3>
        </div>
      </div>

      {selectedStreamUrl && (
        <div className="relative mx-auto mb-6 rounded-xl overflow-hidden border border-white/15 shadow-md w-[320px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[900px] md:h-[400px]">
          <iframe
            ref={iframeRef}
            src={selectedStreamUrl}
            allow="fullscreen"
            loading="lazy"
            title="Match Stream"
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      )}

      <div className="font-inter text-yellow-400 text-center mb-4 text-sm sm:text-base">
        ⚠️ Note: On a slow network, start with "No HD" streams to prevent
        buffering. <br />
        💡 If you're redirected or see popups, just close them. For a smoother
        experience, consider using an ad blocker like uBlock Origin.
      </div>

      <div className="text-center mb-10">
        <button
          onClick={() => setShowVideo(true)}
          className="font-inter rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium px-6 py-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Need help setting up uBlock? Click to watch tutorial
        </button>
      </div>

      {showVideo && (
        <div className="aspect-w-16 aspect-h-9 mb-10 rounded-xl overflow-hidden border border-white/15 shadow-md">
          <iframe
            src="https://www.youtube.com/embed/ijvlRpCOgfU?si=xlLaCcoUKavKLKSd"
            allow="fullscreen"
            loading="lazy"
            title="uBlock Help Video"
            className="w-full h-full"
          ></iframe>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-white mb-8 font-playfair">
        Available Streams
      </h2>

      {streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {streams.map((stream, index) => (
            <div
              key={index}
              className="bg-black/60 border border-white/15 p-6 rounded-xl shadow-md transition-all duration-300 hover:border-white/40"
              onMouseEnter={() => {
                const preload = document.createElement("iframe");
                preload.src = stream.embedUrl;
                preload.style.display = "none";
                document.body.appendChild(preload);
                setTimeout(() => document.body.removeChild(preload), 1000);
              }}
            >
              <div className="text-white mb-3">
                <h3 className="font-lora text-xl text-yellow-400 mb-2">
                  Stream #{index + 1}
                </h3>
                <p className="font-lora text-sm sm:text-base">
                  <strong>Language:</strong> {stream.language}
                </p>
                <p className="font-playfair text-sm sm:text-base">
                  <strong>HD:</strong> {stream.hd ? " Yes" : "No"}
                </p>
                <p className="font-playfairtext-sm sm:text-base">
                  <strong>Source:</strong> {stream.source}
                </p>
              </div>
              <div className="text-center">
                <button
                  onClick={() => handleStreamSelection(stream.embedUrl)}
                  className="font-inter rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium px-6 py-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  🎥 Watch Stream
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white font-lora">
          No streams available for this match.
        </p>
      )}

      <iframe
        ref={preloadRef}
        style={{ display: "none" }}
        title="Preload Stream"
        allow="fullscreen"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default MatchDetails;
