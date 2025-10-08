import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MoviesHome = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTVGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, movie, tv
  const [genreFilter, setGenreFilter] = useState(""); // genre id

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
  const TMDB_BASE = "https://api.themoviedb.org/3";

  // Fetch main sections
  const fetchSections = async () => {
    try {
      const [
        trendingMoviesRes,
        trendingTVRes,
        popularMoviesRes,
        popularTVRes,
        topMoviesRes,
        topTVRes,
      ] = await Promise.all([
        axios.get(`${TMDB_BASE}/trending/movie/week`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE}/trending/tv/week`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE}/movie/popular`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE}/tv/popular`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE}/movie/top_rated`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE}/tv/top_rated`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
      ]);

      setTrendingMovies(trendingMoviesRes.data.results);
      setTrendingTV(trendingTVRes.data.results);
      setPopularMovies(popularMoviesRes.data.results);
      setPopularTV(popularTVRes.data.results);
      setTopRatedMovies(topMoviesRes.data.results);
      setTopRatedTV(topTVRes.data.results);

      setFeatured(trendingMoviesRes.data.results[0]);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const [movieGenreRes, tvGenreRes] = await Promise.all([
        axios.get(`${TMDB_BASE}/genre/movie/list`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE}/genre/tv/list`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
      ]);
      setMovieGenres(movieGenreRes.data.genres);
      setTVGenres(tvGenreRes.data.genres);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await axios.get(`${TMDB_BASE}/search/multi`, {
        params: { query: searchQuery },
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      });
      setSearchResults(res.data.results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSections();
      await fetchGenres();
      setLoading(false);
    };
    init();
  }, []);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        Loading movies & TV shows...
      </div>
    );

  const ContentCard = ({ item }) => {
    const title = item.title || item.name;
    const type = item.media_type || (item.first_air_date ? "tv" : "movie");

    // Apply type filter
    if (filter !== "all" && type !== filter) return null;

    // Apply genre filter
    if (genreFilter && !item.genre_ids?.includes(Number(genreFilter)))
      return null;

    return (
      <Link to={`/movies/home/${type}/${item.id}`}>
        <div className="bg-black/60 border border-white/15 p-2 rounded-xl shadow-md transition-all duration-300 hover:border-white/40 w-40 sm:w-48 md:w-52">
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={title}
            className="rounded-lg mb-2"
          />
          <h3 className="font-lora text-white text-sm sm:text-base truncate">
            {title}
          </h3>
          {item.vote_average && (
            <p className="font-inter text-yellow-400 text-sm">
              ⭐ {item.vote_average}
            </p>
          )}
        </div>
      </Link>
    );
  };

  const renderSection = (title, data) => {
    let filteredData = data.filter((item) => {
      const type = item.media_type || (item.first_air_date ? "tv" : "movie");
      return filter === "all" ? true : filter === type;
    });

    if (genreFilter) {
      filteredData = filteredData.filter((item) =>
        item.genre_ids?.includes(Number(genreFilter)),
      );
    }

    if (filteredData.length === 0) return null;

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-playfair mb-4">{title}</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {filteredData.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 text-white">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 my-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-xl">
          <input
            type="text"
            placeholder="Search movies & TV shows..."
            className="w-full px-4 py-3 rounded-l-full bg-black/60 border border-white/15 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-3 rounded-r-full font-semibold hover:bg-yellow-300 transition duration-200"
          >
            Search
          </button>
        </form>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setGenreFilter(""); // reset genre filter when main type changes
          }}
          className="bg-black/60 border border-white/15 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>

        {(filter === "movie" ? movieGenres : filter === "tv" ? tvGenres : [])
          .length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-black/60 border border-white/15 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Genres</option>
            {(filter === "movie" ? movieGenres : tvGenres).map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-playfair mb-4">Search Results</h2>
          <div className="flex gap-4 overflow-x-auto py-2">
            {searchResults.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Hero Banner */}
      {featured && (
        <div
          className="relative rounded-xl overflow-hidden mb-12 shadow-md"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "400px",
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4 drop-shadow-lg">
              {featured.title || featured.name}
            </h1>
            <Link
              to={`/movies/home/${
                featured.media_type ||
                (featured.first_air_date ? "tv" : "movie")
              }/${featured.id}`}
            >
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition duration-200">
                Play Now
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Sections */}
      {renderSection("Trending Movies", trendingMovies)}
      {renderSection("Trending TV Shows", trendingTV)}
      {renderSection("Popular Movies", popularMovies)}
      {renderSection("Popular TV Shows", popularTV)}
      {renderSection("Top Rated Movies", topRatedMovies)}
      {renderSection("Top Rated TV Shows", topRatedTV)}

      {/* Movie Genres */}
      {movieGenres.length > 0 && filter !== "tv" && (
        <div className="mb-12">
          <h2 className="text-2xl font-playfair mb-4">Movie Genres</h2>
          {movieGenres.map((genre) => (
            <GenreSection
              key={genre.id}
              genre={genre}
              type="movie"
              filter={filter}
              genreFilter={genreFilter}
            />
          ))}
        </div>
      )}

      {/* TV Genres */}
      {tvGenres.length > 0 && filter !== "movie" && (
        <div className="mb-12">
          <h2 className="text-2xl font-playfair mb-4">TV Show Genres</h2>
          {tvGenres.map((genre) => (
            <GenreSection
              key={genre.id}
              genre={genre}
              type="tv"
              filter={filter}
              genreFilter={genreFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Updated GenreSection to respect main type + genre filters
const GenreSection = ({ genre, type, filter, genreFilter }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchGenreItems = async () => {
      try {
        const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
        const TMDB_BASE = "https://api.themoviedb.org/3";
        const res = await axios.get(`${TMDB_BASE}/discover/${type}`, {
          params: { with_genres: genre.id, sort_by: "popularity.desc" },
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        });
        setItems(res.data.results.slice(0, 10));
      } catch (err) {
        console.error(`Error fetching ${genre.name} ${type}:`, err);
      }
    };
    fetchGenreItems();
  }, [genre.id, type]);

  // Respect main type + genre filter
  const displayedItems = items.filter((item) => {
    const itemType = item.first_air_date ? "tv" : "movie";
    if (filter !== "all" && itemType !== filter) return false;
    if (genreFilter && !item.genre_ids.includes(Number(genreFilter)))
      return false;
    return true;
  });

  if (!displayedItems.length) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-lora mb-2">{genre.name}</h3>
      <div className="flex gap-4 overflow-x-auto py-2">
        {displayedItems.map((item) => (
          <Link key={item.id} to={`/movies/home/${type}/${item.id}`}>
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
  );
};

export default MoviesHome;
