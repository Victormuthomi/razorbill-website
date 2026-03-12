import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Activity,
  Info,
  Users,
  Film,
  Cpu,
  Globe,
  Clock,
  Calendar,
  ShieldCheck,
  HardDriveDownload,
} from "lucide-react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const TMDB_BASE = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: TMDB_BASE,
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

const MovieDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [detailRes, castRes, videosRes, similarRes] = await Promise.all([
          api.get(`/${type}/${id}`),
          api.get(`/${type}/${id}/credits`),
          api.get(`/${type}/${id}/videos`),
          api.get(`/${type}/${id}/similar`),
        ]);

        setDetails(detailRes.data);
        setCast(castRes.data.cast.slice(0, 12));
        setVideos(videosRes.data.results);
        setSimilar(similarRes.data.results.slice(0, 12));

        if (type === "tv" && detailRes.data.seasons?.length > 0) {
          setSelectedSeason(detailRes.data.seasons[0].season_number);
        }
      } catch (err) {
        console.error("Archive Access Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, type]);

  const getStreamURL = () => {
    const base = "https://www.vidking.net/embed";
    return type === "movie"
      ? `${base}/movie/${id}?color=34d399&autoPlay=true`
      : `${base}/tv/${id}/${selectedSeason}/${selectedEpisode}?color=34d399&autoPlay=true`;
  };

  if (loading || !details)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
        <div className="w-10 h-10 border-2 border-lab-emerald border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[9px] uppercase tracking-[0.6em] text-lab-emerald animate-pulse">
          Synchronizing Node {id}...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-lab-emerald selection:text-black pb-24">
      {/* 1. HERO ARCHIVE (Grayscale to Color Transition) */}
      <div className="relative h-[75vh] w-full overflow-hidden group/hero">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            className="w-full h-full object-cover opacity-40 grayscale group-hover/hero:grayscale-0 group-hover/hero:opacity-60 group-hover/hero:scale-105 transition-all duration-[1200ms] ease-out"
            alt="backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        {/* Floating Nav */}
        <div className="absolute top-10 left-6 lg:left-12 z-20">
          <button
            onClick={() => navigate("/movies/home")}
            className="group flex items-center gap-4 bg-black/40 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-2xl hover:border-lab-emerald/50 hover:bg-black/60 transition-all duration-500"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
              Return to Index
            </span>
          </button>
        </div>

        {/* Hero Title Block */}
        <div className="absolute bottom-16 left-6 lg:left-12 right-6 lg:right-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 text-lab-emerald font-mono text-[11px] uppercase tracking-[0.5em] mb-6">
              <Activity size={16} className="animate-pulse" />
              {type === "movie" ? "Cinematic Asset" : "Broadcast Sequence"}
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
              {details.title || details.name}
            </h1>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-lab-emerald/10 border border-lab-emerald/20 rounded-2xl backdrop-blur-md">
                <Star size={18} className="text-lab-emerald fill-lab-emerald" />
                <span className="font-mono text-sm font-black text-lab-emerald tracking-tighter">
                  {details.vote_average?.toFixed(1)}
                </span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/40 font-bold">
                {details.genres?.map((g) => g.name).join(" // ")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. DATA WORKSTATION GRID */}
      <div className="px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
        {/* LEFT COLUMN: Intelligence & Tech Data */}
        <div className="lg:col-span-4 space-y-16">
          {/* Summary Briefing */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <Info size={18} className="text-lab-emerald" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.5em] text-lab-slate font-black">
                Subject Overview
              </h2>
            </div>
            <p className="text-base leading-relaxed text-white/70 font-light italic border-l-2 border-lab-emerald/30 pl-8 py-2">
              {details.overview ||
                "Descriptive data for this node remains classified or unavailable."}
            </p>
          </section>

          {/* Technical Specifications Table */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <Cpu size={18} className="text-lab-emerald" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.5em] text-lab-slate font-black">
                Technical Specs
              </h2>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 space-y-5 backdrop-blur-sm">
              {[
                { label: "Status", value: details.status, icon: ShieldCheck },
                {
                  label: "Duration",
                  value: `${
                    details.runtime || details.episode_run_time?.[0] || "VAR"
                  } MIN`,
                  icon: Clock,
                },
                {
                  label: "Deployment",
                  value: (
                    details.release_date || details.first_air_date
                  )?.split("-")[0],
                  icon: Calendar,
                },
                {
                  label: "Encoding",
                  value: details.original_language?.toUpperCase(),
                  icon: Globe,
                },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <spec.icon
                      size={14}
                      className="text-lab-emerald opacity-60"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-lab-slate">
                      {spec.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-white font-black italic">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 group flex items-center justify-center gap-4 py-6 bg-lab-emerald text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-3xl hover:shadow-[0_0_40px_rgba(52,211,153,0.3)] transition-all duration-500 active:scale-95">
              <HardDriveDownload
                size={18}
                className="group-hover:animate-bounce"
              />
              Request Local Archive
            </button>
          </section>

          {/* Personnel (Cast) - High Fidelity Portrait Grid */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <Users size={18} className="text-lab-emerald" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.5em] text-lab-slate font-black">
                Personnel Files
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {cast.map((person) => (
                <div key={person.id} className="group flex flex-col gap-3">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-xl transition-all duration-500 group-hover:border-lab-emerald/50">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                      className="w-full h-full object-cover object-[center_15%] grayscale group-hover:grayscale-0 transition-all duration-1000"
                      alt={person.name}
                    />
                  </div>
                  <div className="px-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-tight text-white/90 truncate group-hover:text-lab-emerald transition-colors">
                      {person.name}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest text-lab-slate truncate font-bold">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Visual Integration */}
        <div className="lg:col-span-8 space-y-16">
          {/* Node Config Panel (TV Series) */}
          {type === "tv" && (
            <div className="p-2 bg-white/[0.04] border border-white/10 rounded-[2.5rem] flex flex-wrap shadow-inner backdrop-blur-xl">
              <div className="flex-1 min-w-[240px] flex items-center gap-6 px-10 py-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab-emerald font-black italic">
                  Cycle
                </span>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-transparent font-mono text-sm text-white outline-none cursor-pointer flex-1 font-bold"
                >
                  {details.seasons?.map((s) => (
                    <option
                      key={s.id}
                      value={s.season_number}
                      className="bg-neutral-900 text-white"
                    >
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[240px] flex items-center gap-6 px-10 py-6 border-l border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab-emerald font-black italic">
                  Packet
                </span>
                <input
                  type="number"
                  min="1"
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="bg-transparent font-mono text-sm text-white outline-none w-full font-bold"
                />
              </div>
            </div>
          )}

          {/* Main Visual Stream Display */}
          <section className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-black group shadow-[0_60px_120px_-20px_rgba(0,0,0,1)]">
            <iframe
              src={getStreamURL()}
              className="w-full h-full"
              allowFullScreen
              title="Secure Stream Feed"
            />
            <div className="absolute top-10 left-10 flex items-center gap-4 px-5 py-2.5 bg-black/70 backdrop-blur-2xl rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-black text-white/80">
                Protocol Encryption Active
              </span>
            </div>
          </section>

          {/* Visual Briefing (Trailers) */}
          {videos.length > 0 && (
            <section>
              <div className="flex items-center gap-6 mb-10">
                <Film size={20} className="text-lab-emerald" />
                <h2 className="font-mono text-[11px] uppercase tracking-[0.5em] text-lab-slate font-black">
                  Visual Supplemental
                </h2>
              </div>
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-[1.5s] shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${
                    videos.find(
                      (v) => v.type === "Trailer" || v.site === "YouTube"
                    )?.key
                  }`}
                  title="Supplementary Visual Node"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 3. SIMILAR ARCHIVE LINKS (WARMTH ADDED) */}
      <div className="mt-32 px-6 lg:px-12">
        <div className="flex items-center gap-8 mb-16">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white/5 select-none">
            Neural Linkages
          </h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="flex gap-10 overflow-x-auto pb-16 no-scrollbar snap-x">
          {similar.map((item) => (
            <Link
              key={item.id}
              to={`/movies/home/${type}/${item.id}`}
              className="group shrink-0 w-56 sm:w-72 snap-start"
            >
              <div className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-white/10 bg-neutral-900 mb-6 transition-all duration-700 group-hover:border-lab-emerald group-hover:-translate-y-4 shadow-2xl">
                {/* Always in Color for Warmth and Discovery */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  alt="linkage-poster"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-[12px] font-black uppercase tracking-tight text-white/50 group-hover:text-lab-emerald transition-colors truncate">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center gap-2 font-mono text-[9px] text-lab-emerald opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star size={10} className="fill-lab-emerald" />
                  {item.vote_average?.toFixed(1)} // SYNC ACTIVE
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
