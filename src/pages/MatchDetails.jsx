import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

const MatchDetails = () => {
  const { id } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedStreamUrl, setSelectedStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [relatedMatches, setRelatedMatches] = useState([]);

  const iframeRef = useRef(null);
  const preloadRef = useRef(null);

  const getTeamsFromId = useCallback((matchId) => {
    const parts = matchId.split("-vs-");
    if (parts.length === 2) {
      const formatTeam = (team) =>
        team
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      return { teamA: formatTeam(parts[0]), teamB: formatTeam(parts[1]) };
    }
    return { teamA: "Team A", teamB: "Team B" };
  }, []);

  // Fetch match details and streams
  const fetchMatchDetails = useCallback(async () => {
    const controller = new AbortController();
    try {
      const res = await fetch(
        "https://razorbill-backend.onrender.com/api/matches/all/popular",
        { signal: controller.signal },
      );
      if (!res.ok) throw new Error("Failed to fetch matches.");
      const allMatches = await res.json();
      const match = allMatches.find((m) => m.id === id);

      if (!match) {
        setError("Match not found.");
        setLoading(false);
        return;
      }

      setMatchDetails(match);

      // Fetch streams for the match
      if (match.sources?.length > 0) {
        const streamPromises = match.sources.map(async (src) => {
          try {
            const r = await fetch(
              `https://razorbill-backend.onrender.com/api/stream/${src.source}/${src.id}`,
            );
            if (!r.ok) return null;
            return await r.json();
          } catch (err) {
            console.error("Stream fetch failed:", err);
            return null;
          }
        });

        const results = await Promise.all(streamPromises);
        const validStreams = results
          .filter((r) => Array.isArray(r))
          .flat()
          .filter((s) => s?.embedUrl);

        setStreams(validStreams);
        if (validStreams.length > 0)
          setSelectedStreamUrl(validStreams[0].embedUrl);
      } else {
        setError("No sources found for this match.");
      }
    } catch (err) {
      if (err.name !== "AbortError") setError("Error fetching match details.");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [id]);

  // Fetch related live matches
  useEffect(() => {
    if (!matchDetails) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(
          "https://razorbill-backend.onrender.com/api/matches/live/popular",
        );
        if (!res.ok) throw new Error("Failed to fetch live matches.");
        const data = await res.json();

        const related = data
          .filter(
            (m) =>
              m.category === matchDetails.category && m.id !== matchDetails.id,
          )
          .sort((a, b) => (b.popular === true) - (a.popular === true)) // popular first
          .slice(0, 5);

        setRelatedMatches(related);
      } catch (err) {
        console.error("Error fetching related matches:", err);
      }
    };

    fetchRelated();
  }, [matchDetails]);

  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  const handleStreamSelection = (streamUrl) => {
    setSelectedStreamUrl(streamUrl);
    if (preloadRef.current) preloadRef.current.src = streamUrl;
  };

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading match details...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  const { teamA, teamB } = getTeamsFromId(id);

  const homeBadge = matchDetails?.teams?.home?.badge
    ? `https://razorbill-backend.onrender.com/api/images/badge/${matchDetails.teams.home.badge}.webp`
    : null;
  const awayBadge = matchDetails?.teams?.away?.badge
    ? `https://razorbill-backend.onrender.com/api/images/badge/${matchDetails.teams.away.badge}.webp`
    : null;

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      <div className="flex justify-center gap-8 mb-8 items-center">
        <div className="flex items-center gap-2">
          {homeBadge && (
            <img src={homeBadge} alt={teamA} className="h-12 w-auto" />
          )}
          <h3 className="font-lora text-white text-lg sm:text-xl">{teamA}</h3>
        </div>
        <div className="text-white text-2xl font-playfair">VS</div>
        <div className="flex items-center gap-2">
          {awayBadge && (
            <img src={awayBadge} alt={teamB} className="h-12 w-auto" />
          )}
          <h3 className="font-lora text-white text-lg sm:text-xl">{teamB}</h3>
        </div>
      </div>

      {/* Main content + related matches sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Video and Streams */}
        <div className="flex-1">
          {selectedStreamUrl && (
            <div className="relative rounded-xl overflow-hidden border border-white/15 shadow-md w-full h-[360px] md:h-[400px] mb-6">
              <iframe
                ref={iframeRef}
                src={selectedStreamUrl}
                allowFullScreen
                loading="lazy"
                title="Match Stream"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          )}

          <div className="font-inter text-yellow-400 text-center mb-4 text-sm sm:text-base">
            ⚠️ Note: On a slow network, start with "No HD" streams to prevent
            buffering. <br />
            💡 If redirected or see popups, just close them. Use ad blocker like
            uBlock Origin.
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
                allowFullScreen
                loading="lazy"
                title="uBlock Help Video"
                className="w-full h-full"
              />
            </div>
          )}

          {/* Streams */}
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
                    <p className="font-playfair text-sm sm:text-base">
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
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Related Live Matches Sidebar */}
        <div className="md:w-1/3 flex-shrink-0">
          <h3 className="text-white text-xl font-playfair mb-4">
            Related Live Matches
          </h3>
          {relatedMatches.length === 0 ? (
            <p className="text-white text-sm">No related live matches.</p>
          ) : (
            <div className="space-y-4">
              {relatedMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/matches/${match.id}`}
                  className="flex items-center bg-black/60 border border-white/15 p-3 rounded-xl transition hover:border-white/40"
                >
                  <img
                    src={`https://razorbill-backend.onrender.com/api/images/badge/${match.teams.home.badge}.webp`}
                    alt={match.teams.home.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3 text-white text-sm">
                    {match.teams.home.name} vs {match.teams.away.name}
                    <p className="text-gray-300 text-xs mt-1">
                      {new Date(match.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
