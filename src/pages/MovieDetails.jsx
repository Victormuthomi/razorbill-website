import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, Heart } from "lucide-react"; // Added Heart

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

// --- WATCHLIST HELPERS ---
const getWatchlist = () =>
  JSON.parse(localStorage.getItem("watchlist") || "[]");

const isInWatchlist = (id) => getWatchlist().some((i) => i.id === id);

const toggleWatchlist = (item, type) => {
  let list = getWatchlist();
  const exists = list.find((i) => i.id === item.id);

  if (exists) {
    list = list.filter((i) => i.id !== item.id);
  } else {
    list.push({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      media_type: type,
    });
  }
  localStorage.setItem("watchlist", JSON.stringify(list));
};

const MovieDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false); // Track save state

  // TV Logic
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res, castRes, simRes] = await Promise.all([
          api.get(`/${type}/${id}`),
          api.get(`/${type}/${id}/credits`),
          api.get(`/${type}/${id}/similar`),
        ]);
        setDetails(res.data);
        setCast(castRes.data.cast.slice(0, 8));
        setSimilar(simRes.data.results.slice(0, 10));
        setIsSaved(isInWatchlist(res.data.id)); // Check initial save status
        if (type === "tv") setSelectedSeason(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  useEffect(() => {
    if (type === "tv" && selectedSeason) {
      api
        .get(`/tv/${id}/season/${selectedSeason}`)
        .then((res) => setSeasonData(res.data));
    }
  }, [selectedSeason, id, type]);

  const getStreamURL = () => {
    const base = "https://www.vidking.net/embed";
    return type === "movie"
      ? `${base}/movie/${id}?color=10b981&autoPlay=true`
      : `${base}/tv/${id}/${selectedSeason}/${selectedEpisode}?color=10b981&autoPlay=true`;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-mono text-zinc-500">
        INITIALIZING STREAM...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* --- HERO --- */}
      <div className="relative h-[80vh] w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          className="w-full h-full object-cover opacity-30"
          alt="backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute top-6 left-6 z-10 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-zinc-900/80 backdrop-blur p-3 rounded-full hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* --- SAVED HEART BUTTON --- */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => {
              toggleWatchlist(details, type);
              setIsSaved(!isSaved); // Toggle visual state
            }}
            className="bg-zinc-900/80 backdrop-blur p-3 rounded-full hover:bg-emerald-500 transition-colors"
          >
            <Heart
              size={20}
              className={
                isSaved ? "fill-emerald-500 text-emerald-500" : "text-white"
              }
            />
          </button>
        </div>

        <div className="absolute bottom-0 p-8 md:p-12 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            {details.title || details.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
            <span>
              {details.release_date?.split("-")[0] ||
                details.first_air_date?.split("-")[0]}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Star size={12} fill="currentColor" />{" "}
              {details.vote_average?.toFixed(1)}
            </span>
          </div>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-3">
            {details.overview}
          </p>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {type === "tv" && (
              <div className="flex flex-col md:flex-row gap-4 bg-zinc-900 p-4 rounded-xl">
                <select
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="w-full md:w-auto bg-zinc-800 px-4 py-2 rounded-lg text-xs font-bold uppercase outline-none"
                >
                  {details.seasons?.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="w-full bg-zinc-800 px-4 py-2 rounded-lg text-xs font-bold uppercase flex-1 outline-none"
                >
                  {seasonData?.episodes?.map((ep) => (
                    <option key={ep.id} value={ep.episode_number}>
                      Ep {ep.episode_number}: {ep.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
              <iframe
                src={getStreamURL()}
                className="w-full h-full"
                allowFullScreen
                title="Player"
              />
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4">
              Cast
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="text-[10px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                    className="rounded-lg mb-2 w-full aspect-[2/3] object-cover"
                    alt={person.name}
                  />
                  <p className="font-bold truncate">{person.name}</p>
                  <p className="text-zinc-500 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="overflow-hidden">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">
            Similar Titles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {similar.map((item) => (
              <Link
                key={item.id}
                to={`/movies/home/${item.media_type || type}/${item.id}`}
                className="group"
              >
                <div className="aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    alt={item.title || item.name}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase text-zinc-300 group-hover:text-emerald-400 transition-colors truncate">
                  {item.title || item.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
