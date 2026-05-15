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
import StudentDashboard from "./pages/StudentDashboard";
import CreateApplicationPage from "./pages/CreateApplicationPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";

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
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/application"
          element={<CreateApplicationPage />}
        />

        <Route
          path="/student/my-applications"
          element={<MyApplicationsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;