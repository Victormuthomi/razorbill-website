// src/App.jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Homepage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} />
      {/* Add more routes here later */}
    </>,
  ),
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
