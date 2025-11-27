import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import BASE_URL from "../api";

const MatchDetails = () => {
  const { id } = useParams();

  const [matchDetails, setMatchDetails] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMatches, setRelatedMatches] = useState([]);

  const iframeRef = useRef(null);
  const preloadRef = useRef(null);

  // Fetch match details + stream sources
  const fetchMatchDetails = useCallback(async () => {
    const controller = new AbortController();

    try {
      const res = await fetch(`${BASE_URL}/api/matches/${id}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch match details.");

      const match = await res.json();

      if (!match || !match.id) {
        setError("Match not found.");
        setLoading(false);
        return;
      }

      setMatchDetails(match);

      // Fetch streams from all sources in match.sources
      if (match.sources?.length > 0) {
        const streamPromises = match.sources.map(async (src) => {
          try {
            const r = await fetch(
              `${BASE_URL}/api/streams/${src.source}/${src.id}`,
            );
            if (!r.ok) return null;
            return await r.json();
          } catch {
            return null;
          }
        });

        const results = await Promise.all(streamPromises);

        const valid = results
          .filter((r) => Array.isArray(r))
          .flat()
          .filter((s) => s?.embedUrl);

        setStreams(valid);

        if (valid.length > 0) {
          setSelectedStreamIndex(0); // first stream default
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Error fetching match details.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [id]);

  // Fetch related matches
  useEffect(() => {
    if (!matchDetails) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/matches/live/popular`);
        if (!res.ok) throw new Error("Failed to fetch live matches.");

        const data = await res.json();

        const related = data
          .filter(
            (m) =>
              m.category === matchDetails.category && m.id !== matchDetails.id,
          )
          .sort((a, b) => (b.popular === true) - (a.popular === true))
          .slice(0, 5);

        setRelatedMatches(related);
      } catch (err) {
        console.error("Error fetching related matches:", err);
      }
    };

    fetchRelated();
  }, [matchDetails]);

  // Fetch match details on mount or ID change
  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  // 🔄 AUTO-SWITCH STREAM FALLBACK
  const tryNextStream = useCallback(() => {
    if (streams.length === 0) return;

    let nextIndex = selectedStreamIndex + 1;

    if (nextIndex >= streams.length) {
      setError("All streams failed to load.");
      return;
    }

    console.warn(
      `Stream #${selectedStreamIndex + 1} failed → Trying stream #${nextIndex + 1}`,
    );

    setSelectedStreamIndex(nextIndex);
  }, [selectedStreamIndex, streams]);

  const handleStreamError = () => {
    tryNextStream();
  };

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading match details...
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  const teamA = matchDetails?.teams?.home?.name || "Team A";
  const teamB = matchDetails?.teams?.away?.name || "Team B";

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      {/* Team Names */}
      <div className="flex justify-center gap-8 mb-8 items-center">
        <h3 className="font-lora text-white text-lg sm:text-xl">{teamA}</h3>
        <div className="text-white text-2xl font-playfair">VS</div>
        <h3 className="font-lora text-white text-lg sm:text-xl">{teamB}</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* STREAM PLAYER */}
        <div className="flex-1">
          {streams.length > 0 && (
            <div className="relative rounded-xl overflow-hidden border border-white/15 shadow-md w-full h-[360px] md:h-[400px] mb-6">
              <iframe
                ref={iframeRef}
                src={streams[selectedStreamIndex]?.embedUrl}
                allowFullScreen
                loading="lazy"
                title="Match Stream"
                onError={handleStreamError}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-white mb-8 font-playfair">
            Available Streams
          </h2>

          {/* STREAM LIST */}
          {streams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {streams.map((stream, index) => (
                <div
                  key={index}
                  className="bg-black/60 border border-white/15 p-6 rounded-xl shadow-md transition-all duration-300 hover:border-white/40"
                >
                  <div className="text-white mb-3">
                    <h3 className="font-lora text-xl text-yellow-400 mb-2">
                      Stream #{index + 1}
                    </h3>
                    <p className="font-lora text-sm sm:text-base">
                      <strong>Language:</strong> {stream.language}
                    </p>
                    <p className="font-lora text-sm sm:text-base">
                      <strong>HD:</strong> {stream.hd ? "Yes" : "No"}
                    </p>
                    <p className="font-lora text-sm sm:text-base">
                      <strong>Source:</strong> {stream.source}
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setSelectedStreamIndex(index)}
                      className="font-inter rounded-full bg-white/10 hover:bg-white hover:text-black text-white font-medium px-6 py-3 transition duration-200"
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

          {/* Hidden Preloader Iframe */}
          <iframe
            ref={preloadRef}
            style={{ display: "none" }}
            title="Preload Stream"
            allowFullScreen
          />
        </div>

        {/* RELATED MATCHES */}
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
                  <div className="ml-3 text-white text-sm">
                    {match.teams?.home?.name || "Home"} vs{" "}
                    {match.teams?.away?.name || "Away"}
                    <p className="text-gray-300 text-xs mt-1">
                      {match.date
                        ? new Date(match.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
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
