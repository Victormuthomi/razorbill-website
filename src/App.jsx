// src/App.jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Homepage";
import Matches from "./pages/Matches"; // Import MatchesPage component
import MatchDetails from "./pages/MatchDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/watch/:matchId" element={<MatchDetails />} />
      {/* Add more routes here later */}
    </>,
  ),
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
