import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import ApplicationsPage from "./pages/ApplicationsPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard" />
              : <LoginPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            token
              ? <DashboardPage />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/rooms"
          element={
            token
              ? <RoomsPage />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/applications"
          element={
            token
              ? <ApplicationsPage />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;