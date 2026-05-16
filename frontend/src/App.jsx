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
import RegisterPage from "./pages/RegisterPage";

import StudentDashboard from "./pages/StudentDashboard";
import CreateApplicationPage from "./pages/CreateApplicationPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const redirectByRole = () => {
    if (!token) return <LoginPage />;

    if (role === "STUDENT") {
      return <Navigate to="/student" />;
    }

    return <Navigate to="/dashboard" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={redirectByRole()} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/application"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CreateApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-applications"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;