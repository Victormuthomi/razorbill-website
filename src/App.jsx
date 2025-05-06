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
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />
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
