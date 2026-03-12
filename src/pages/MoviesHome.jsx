import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Activity,
  ChevronDown,
  Check,
  LayoutGrid,
  X,
  Play,
  Star,
  ArrowRight,
} from "lucide-react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const TMDB_BASE = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: TMDB_BASE,
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

const MoviesHome = () => {
  const [sections, setSections] = useState({
    trendingMovies: [],
    trendingTV: [],
    popularMovies: [],
    popularTV: [],
    topRatedMovies: [],
    topRatedTV: [],
  });
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTVGenres] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState("all"); // all, movie, tv
  const [genreFilter, setGenreFilter] = useState("");
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const genreMenuRef = useRef(null);

  const initLoad = async () => {
    try {
      setLoading(true);
      const [trM, trT, popM, popT, topM, topT, mG, tG] = await Promise.all([
        api.get("/trending/movie/week"),
        api.get("/trending/tv/week"),
        api.get("/movie/popular"),
        api.get("/tv/popular"),
        api.get("/movie/top_rated"),
        api.get("/tv/top_rated"),
        api.get("/genre/movie/list"),
        api.get("/genre/tv/list"),
      ]);

      setSections({
        trendingMovies: trM.data.results,
        trendingTV: trT.data.results,
        popularMovies: popM.data.results,
        popularTV: popT.data.results,
        topRatedMovies: topM.data.results,
        topRatedTV: topT.data.results,
      });
      setMovieGenres(mG.data.genres);
      setTVGenres(tG.data.genres);
      setFeatured(trM.data.results[0]);
    } catch (err) {
      console.error("Uplink Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await api.get("/search/multi", {
        params: { query: searchQuery },
      });
      setSearchResults(res.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initLoad();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genreMenuRef.current && !genreMenuRef.current.contains(e.target))
        setIsGenreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border border-lab-emerald border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-[9px] uppercase tracking-[0.6em] text-lab-emerald">
          Syncing Archive...
        </p>
      </div>
    );

  const HorizontalRow = ({ title, items, type }) => {
    const filtered = items.filter((item) => {
      const itemType =
        item.media_type || (item.first_air_date ? "tv" : "movie");
      const matchesType = filter === "all" || itemType === filter;
      const matchesGenre =
        !genreFilter || item.genre_ids?.includes(Number(genreFilter));
      return matchesType && matchesGenre;
    });

    if (filtered.length === 0) return null;

    return (
      <div className="mb-16 px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.5em] text-lab-emerald whitespace-nowrap">
            {title}
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-lab-emerald/20 to-transparent" />
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/movies/home/${type || "movie"}/${item.id}`}
              className="group shrink-0 w-44 sm:w-56"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 mb-4 transition-all duration-500 group-hover:border-lab-emerald/40 group-hover:shadow-[0_0_50px_rgba(52,211,153,0.15)]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="poster"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[9px] font-mono text-lab-emerald font-bold">
                    ⭐ {item.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-tight text-white/90 truncate group-hover:text-lab-emerald transition-colors">
                {item.title || item.name}
              </h3>
              <p className="text-[9px] font-mono text-lab-slate uppercase tracking-widest mt-1 opacity-40">
                {item.release_date?.split("-")[0] ||
                  item.first_air_date?.split("-")[0] ||
                  "Archive"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-lab-emerald selection:text-black pb-20 overflow-x-hidden">
      {/* --- PREMIUM CONTROL BAR --- */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 items-center">
          {/* 1. Search */}
          <form
            onSubmit={handleSearch}
            className="relative w-full xl:flex-1 group"
          >
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-lab-slate group-focus-within:text-lab-emerald transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Query Media Archive..."
              className="w-full pl-16 pr-6 py-4.5 bg-white/[0.02] border border-white/10 rounded-2xl focus:outline-none focus:border-lab-emerald/50 text-[11px] font-mono uppercase tracking-[0.2em] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-center">
            {/* 2. Segmented Switcher */}
            <div className="flex p-1.5 bg-white/[0.02] border border-white/10 rounded-2xl">
              {["all", "movie", "tv"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilter(t);
                    setGenreFilter("");
                  }}
                  className={`px-8 py-3 rounded-xl font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-500 ${
                    filter === t
                      ? "bg-lab-emerald text-black font-black shadow-[0_0_25px_rgba(52,211,153,0.3)]"
                      : "text-lab-slate hover:text-white"
                  }`}
                >
                  {t === "all"
                    ? "Unified"
                    : t === "movie"
                    ? "Cinema"
                    : "Broadcast"}
                </button>
              ))}
            </div>

            {/* 3. Glassmorphism Dropdown */}
            <div className="relative" ref={genreMenuRef}>
              <button
                onClick={() => setIsGenreOpen(!isGenreOpen)}
                className="flex items-center gap-4 px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-white/30 transition-all"
              >
                <LayoutGrid size={14} className="text-lab-emerald" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">
                  {genreFilter
                    ? movieGenres.find((g) => g.id == genreFilter)?.name ||
                      tvGenres.find((g) => g.id == genreFilter)?.name ||
                      "Category"
                    : "Categories"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-lab-slate transition-transform duration-500 ${
                    isGenreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isGenreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-[calc(100%+16px)] right-0 w-72 bg-neutral-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[100]"
                  >
                    <div className="grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                      <button
                        onClick={() => {
                          setGenreFilter("");
                          setIsGenreOpen(false);
                        }}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 text-left transition-all"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white">
                          Full Database
                        </span>
                        {!genreFilter && (
                          <Check size={14} className="text-lab-emerald" />
                        )}
                      </button>
                      <div className="h-px bg-white/5 my-2 mx-4" />
                      {(filter === "tv" ? tvGenres : movieGenres).map((g) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            setGenreFilter(g.id);
                            setIsGenreOpen(false);
                          }}
                          className="flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 text-left transition-all group"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-widest text-lab-slate group-hover:text-white transition-colors">
                            {g.name}
                          </span>
                          {genreFilter == g.id && (
                            <Check size={14} className="text-lab-emerald" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <AnimatePresence>
        {!searchQuery && featured && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[75vh] w-full flex flex-col justify-end px-6 lg:px-12 pb-24 group/hero overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
                className="w-full h-full object-cover opacity-60 grayscale group-hover/hero:grayscale-0 group-hover/hero:opacity-80 group-hover/hero:scale-105 transition-all duration-[1500ms] ease-out"
                alt="hero"
              />
              {/* Layered overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent" />
            </div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative z-10 max-w-5xl space-y-8"
            >
              <div className="flex items-center gap-4 text-lab-emerald font-mono text-[10px] uppercase tracking-[0.6em]">
                <div className="w-12 h-px bg-lab-emerald/50" />
                <Activity size={14} className="animate-pulse" />
                Priority Asset // Trending
              </div>

              <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]">
                {featured.title || featured.name}
              </h1>

              <div className="flex items-center gap-6 pt-10">
                <Link
                  to={`/movies/home/${
                    featured.first_air_date ? "tv" : "movie"
                  }/${featured.id}`}
                  className="group/btn flex items-center gap-6 px-14 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-lab-emerald hover:text-black transition-all duration-500 shadow-2xl active:scale-95"
                >
                  Initialize Stream
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-3 transition-transform duration-500"
                  />
                </Link>

                <div className="hidden md:flex flex-col border-l border-white/10 pl-8">
                  <span className="font-mono text-[9px] text-lab-slate uppercase tracking-widest mb-1">
                    Archive Rating
                  </span>
                  <span className="font-mono text-xl font-black text-lab-emerald tracking-tighter">
                    {featured.vote_average?.toFixed(1)}{" "}
                    <span className="text-[10px] text-lab-slate">/ 10</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- MAIN CONTENT GRID --- */}
      <div className="relative z-10 -mt-10 bg-black pt-20">
        {searchResults.length > 0 && (
          <HorizontalRow title="Search Analysis" items={searchResults} />
        )}

        <HorizontalRow
          title="Trending Cinema"
          items={sections.trendingMovies}
          type="movie"
        />
        <HorizontalRow
          title="Broadcast Series"
          items={sections.trendingTV}
          type="tv"
        />
        <HorizontalRow
          title="Popular Demand"
          items={sections.popularMovies}
          type="movie"
        />
        <HorizontalRow
          title="Global Broadcasts"
          items={sections.popularTV}
          type="tv"
        />
        <HorizontalRow
          title="Archived Masterpieces"
          items={sections.topRatedMovies}
          type="movie"
        />
        <HorizontalRow
          title="Top Rated TV"
          items={sections.topRatedTV}
          type="tv"
        />

        {/* --- DYNAMIC GENRE ARCHIVES --- */}
        <div className="mt-20">
          <div className="px-6 lg:px-12 mb-16 flex items-end gap-6">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white/10">
              Deep Archives
            </h2>
            <div className="h-px flex-1 bg-white/5 mb-4" />
          </div>

          {(filter === "tv" ? tvGenres : movieGenres).map((genre) => (
            <GenreSection
              key={genre.id}
              genre={genre}
              type={filter === "all" ? "movie" : filter}
              filter={filter}
              genreFilter={genreFilter}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const GenreSection = ({ genre, type, filter, genreFilter }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/discover/${type}`, {
          params: { with_genres: genre.id, sort_by: "popularity.desc" },
        });
        setItems(res.data.results);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [genre.id, type]);

  if (genreFilter && Number(genreFilter) !== genre.id) return null;
  if (items.length === 0) return null;

  return (
    <div className="mb-20 px-6 lg:px-12 group/section">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-2 h-2 rounded-full bg-lab-emerald shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        <h3 className="font-mono text-[11px] uppercase tracking-[0.5em] text-lab-slate group-hover/section:text-white transition-colors">
          {genre.name} Protocols
        </h3>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/movies/home/${type}/${item.id}`}
            className="group shrink-0 w-44 sm:w-56"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-neutral-900 mb-5 transition-all duration-700 group-hover:border-lab-emerald/20 group-hover:-translate-y-2">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                alt="poster"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
            </div>
            <h4 className="text-[12px] font-bold uppercase tracking-tight text-white/50 group-hover:text-lab-emerald transition-all truncate">
              {item.title || item.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoviesHome;
