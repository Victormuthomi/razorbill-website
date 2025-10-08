// src/App.jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import { Analytics } from "@vercel/analytics/react";

import Layout from "./components/Layout";
import HomePage from "./pages/Homepage";

// Matches
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";

// Results
import ResultsPage from "./pages/ResultsPage";

// Movies
import Movies from "./pages/Movies";
import MoviesHome from "./pages/MoviesHome";
import MovieDetails from "./pages/MovieDetails";

// SportGPT
import Sportgpt from "./pages/Sportgpt";

// Chat
import Chat from "./pages/Chat";

// Not Found
import NotFound from "./pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      {/* Home */}
      <Route index element={<HomePage />} />

      {/* Matches */}
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />

      {/* Results */}
      <Route path="/results" element={<ResultsPage />} />

      {/* Movies */}
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/home" element={<MoviesHome />} />

      {/* Dynamic route for movie or TV details */}
      <Route path="/movies/home/:type/:id" element={<MovieDetails />} />
      {/* Optional route for TV shows with season/episode */}
      <Route
        path="/movies/home/:type/:id/:season/:episode"
        element={<MovieDetails />}
      />

      {/* SportGPT */}
      <Route path="/sportgpt" element={<Sportgpt />} />

      {/* Chat */}
      <Route path="/chat" element={<Chat />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Analytics />
    </div>
  );
};

export default App;
