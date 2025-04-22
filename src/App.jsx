// src/App.jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Layout from "./components/Layout"; // ← Import your Layout
import HomePage from "./pages/Homepage";
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";
import NotFound from "./pages/NotFound"; // Import the new 404 pag

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />
      <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
    </Route>,
  ),
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
