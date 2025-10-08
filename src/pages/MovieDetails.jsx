// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { type, id } = useParams(); // type = movie | tv, id = TMDB ID
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
  const TMDB_BASE = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Main details
        const detailRes = await axios.get(`${TMDB_BASE}/${type}/${id}`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        });
        setDetails(detailRes.data);

        // Cast
        const castRes = await axios.get(`${TMDB_BASE}/${type}/${id}/credits`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        });
        setCast(castRes.data.cast.slice(0, 10)); // Top 10 cast

        // Videos / Trailers
        const videosRes = await axios.get(`${TMDB_BASE}/${type}/${id}/videos`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        });
        setVideos(videosRes.data.results);

        // Similar
        const similarRes = await axios.get(
          `${TMDB_BASE}/${type}/${id}/similar`,
          {
            headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
          },
        );
        setSimilar(similarRes.data.results.slice(0, 12));

        // For TV: default season & episode
        if (type === "tv" && detailRes.data.seasons?.length > 0) {
          setSelectedSeason(detailRes.data.seasons[0].season_number);
          setSelectedEpisode(1);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [id, type, TMDB_TOKEN]);

  // VidKing URL builder
  const getVidKingURL = () => {
    const base = "https://www.vidking.net/embed";
    const color = "ffcc00"; // Theme yellow
    const autoPlay = true;
    const params = `?color=${color}&autoPlay=${autoPlay}&nextEpisode=true&episodeSelector=true`;

    if (type === "movie") {
      return `${base}/movie/${id}${params}`;
    } else {
      return `${base}/tv/${id}/${selectedSeason}/${selectedEpisode}${params}`;
    }
  };

  // Player listener
  useEffect(() => {
    const handlePlayerMessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "PLAYER_EVENT") {
            console.log("Player Event:", parsed.data);
          }
        } catch (err) {
          console.error("Error parsing player event", err);
        }
      }
    };

    window.addEventListener("message", handlePlayerMessage);
    return () => window.removeEventListener("message", handlePlayerMessage);
  }, []);

  if (loading || !details)
    return (
      <div className="text-white text-center py-10">Loading details...</div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-12 text-white">
      {/* Hero Banner */}
      <div
        className="relative rounded-xl overflow-hidden mb-8 shadow-md"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
          {/* ⬅ Back Button */}
          <button
            onClick={() => navigate("/movies/home")}
            className="absolute top-5 left-5 bg-black/50 hover:bg-black/70 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            ⬅ Back to Movies Home
          </button>

          <h1 className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4 drop-shadow-lg">
            {details.title || details.name}
          </h1>
          <p className="text-white mb-4">{details.tagline}</p>

          {/* TV Seasons & Episodes above Play button */}
          {type === "tv" && details.seasons?.length > 0 && (
            <div className="flex gap-4 mb-4 flex-wrap justify-center">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="bg-black/60 border border-white/15 text-white px-4 py-2 rounded-full"
              >
                {details.seasons.map((s) => (
                  <option key={s.id} value={s.season_number}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                className="bg-black/60 border border-white/15 text-white px-4 py-2 rounded-full"
              >
                {Array.from(
                  { length: details.episodes || 10 },
                  (_, i) => i + 1,
                ).map((ep) => (
                  <option key={ep} value={ep}>
                    Episode {ep}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link to={getVidKingURL()}>
            <button className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition duration-200">
              Play Now
            </button>
          </Link>
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-playfair mb-2">Overview</h2>
        <p className="text-white mb-2">{details.overview}</p>
        <p className="text-white">
          <strong>Rating:</strong> {details.vote_average} ⭐ |{" "}
          <strong>Genres:</strong>{" "}
          {details.genres?.map((g) => g.name).join(", ")}
        </p>
        {type === "tv" && (
          <p className="text-white">
            <strong>Seasons:</strong> {details.number_of_seasons} |{" "}
            <strong>Episodes:</strong> {details.number_of_episodes}
          </p>
        )}
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto py-2">
            {cast.map((c) => (
              <div key={c.id} className="w-32 flex-shrink-0 text-center">
                <img
                  src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                  alt={c.name}
                  className="rounded-lg mb-2"
                />
                <p className="text-white text-sm truncate">{c.name}</p>
                <p className="text-gray-300 text-xs truncate">{c.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailer */}
      {videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">Trailer</h2>
          {/* Always display only the first YouTube video */}
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videos.find((v) => v.site === "YouTube")?.key}`}
            title={videos.find((v) => v.site === "YouTube")?.name || "Trailer"}
            allowFullScreen
            className="mb-4 rounded-lg"
          />
        </div>
      )}

      {/* Similar Movies / TV Shows */}
      {similar.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-playfair mb-4">You might also like…</h2>
          <div className="flex gap-4 overflow-x-auto py-2">
            {similar.map((item) => (
              <Link
                key={item.id}
                to={`/movies/home/${type}/${item.id}`} // ✅ Corrected navigation link
                className="flex-shrink-0"
              >
                <div className="bg-black/60 border border-white/15 p-2 rounded-xl shadow-md transition-all duration-300 hover:border-white/40 w-40 sm:w-48 md:w-52">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="rounded-lg mb-2"
                  />
                  <h3 className="font-lora text-white text-sm sm:text-base truncate">
                    {item.title || item.name}
                  </h3>
                  {item.vote_average && (
                    <p className="font-inter text-yellow-400 text-sm">
                      ⭐ {item.vote_average}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
