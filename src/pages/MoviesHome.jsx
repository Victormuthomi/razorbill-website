import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Play, Star, Heart } from "lucide-react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

// --- WATCHLIST HELPERS ---
const getWatchlist = () =>
  JSON.parse(localStorage.getItem("watchlist") || "[]");

const isInWatchlist = (id) => getWatchlist().some((i) => i.id === id);

const toggleWatchlist = (item, filter) => {
  let list = getWatchlist();
  const exists = list.find((i) => i.id === item.id);

  if (exists) {
    list = list.filter((i) => i.id !== item.id);
  } else {
    list.push({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      media_type: item.media_type || filter,
    });
  }
  localStorage.setItem("watchlist", JSON.stringify(list));
};

// --- COMPONENT ---
const CATEGORIES = [
  { name: "Action", movie: 28, tv: 10759 },
  { name: "Sci-Fi", movie: 878, tv: 10765 },
  { name: "Horror", movie: 27, tv: 9648 },
  { name: "Comedy", movie: 35, tv: 35 },
  { name: "Drama", movie: 18, tv: 18 },
];

const MoviesHome = () => {
  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("movie");
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // Forces UI update

  const fetchData = async () => {
    setLoading(true);
    try {
      const isSearch = searchQuery.length > 0;
      const endpoint = isSearch ? "/search/multi" : `/discover/${filter}`;

      const genreId = activeCategory
        ? filter === "movie"
          ? activeCategory.movie
          : activeCategory.tv
        : null;

      const params = isSearch
        ? { query: searchQuery }
        : { with_genres: genreId, sort_by: "popularity.desc" };

      const res = await api.get(endpoint, { params });
      const results = res.data.results.filter((i) => i.media_type !== "person");

      setItems(results);
      if (!isSearch) setFeatured(results[0]);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setActiveCategory(null);
    setSearchQuery("");
  };

  useEffect(() => {
    fetchData();
  }, [filter, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* --- CONTROL BAR --- */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchData();
            }}
            className="flex flex-1 gap-2"
          >
            <input
              type="text"
              placeholder="SEARCH TITLES..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-[10px] font-mono tracking-widest focus:border-emerald-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-zinc-800 px-6 rounded-lg hover:bg-emerald-500 transition-colors"
            >
              <Search size={16} />
            </button>
          </form>

          <div className="flex gap-2">
            {/* WATCHLIST NAV LINK */}
            <Link
              to="/movies/watchlist"
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <Heart size={12} className="text-emerald-500" /> My List
            </Link>

            {["movie", "tv"].map((t) => (
              <button
                key={t}
                onClick={() => handleFilterChange(t)}
                className={`px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                  filter === t
                    ? "bg-emerald-500 text-zinc-950"
                    : "bg-zinc-900 hover:bg-zinc-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- VISUAL HERO --- */}
      {!searchQuery && featured && (
        <div className="relative h-[60vh] w-full mb-12">
          <img
            src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
            className="w-full h-full object-cover"
            alt={featured.title || featured.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-12 left-12 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {featured.title || featured.name}
            </h1>
            <p className="text-zinc-400 text-sm mb-6 line-clamp-2 max-w-lg">
              {featured.overview}
            </p>
            <Link
              to={`/movies/home/${featured.media_type || filter}/${
                featured.id
              }`}
              className="inline-flex items-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors"
            >
              Initialize Stream <Play size={12} fill="currentColor" />
            </Link>
          </div>
        </div>
      )}

      {/* --- CATEGORY FILTER --- */}
      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 mb-8 flex gap-2 overflow-x-auto pb-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest border ${
              !activeCategory
                ? "bg-emerald-500 border-emerald-500"
                : "border-zinc-800"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest border ${
                activeCategory?.name === cat.name
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* --- VISUAL GRID --- */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/movies/home/${item.media_type || filter}/${item.id}`}
            className="group relative"
          >
            <div className="relative aspect-[2/3] bg-zinc-900 rounded-2xl overflow-hidden mb-3 border border-zinc-800 group-hover:border-emerald-500 transition-all shadow-xl">
              {/* Heart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevents navigating to details page
                  toggleWatchlist(item, filter);
                  setRefresh(!refresh); // Triggers re-render
                }}
                className="absolute top-2 left-2 z-20 p-2 rounded-full bg-black/60 backdrop-blur hover:bg-emerald-500 transition-colors"
              >
                <Heart
                  size={14}
                  className={`${
                    isInWatchlist(item.id)
                      ? "fill-emerald-500 text-emerald-500"
                      : "text-white"
                  }`}
                />
              </button>

              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.title || item.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[10px] text-zinc-600 font-mono">
                  NO ASSET
                </div>
              )}

              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1">
                <Star size={10} className="text-emerald-400" />{" "}
                {item.vote_average?.toFixed(1) || "0.0"}
              </div>
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-tight text-zinc-300 group-hover:text-emerald-400 transition-colors truncate">
              {item.title || item.name}
            </h3>
          </Link>
        ))}
        {items.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center font-mono text-xs text-zinc-600 uppercase">
            No assets found in this sector.
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesHome;
