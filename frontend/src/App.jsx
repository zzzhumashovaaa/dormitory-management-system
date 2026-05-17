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
import ComplaintsPage from "./pages/ComplaintsPage";
import CreateComplaintPage from "./pages/CreateComplaintPage";
import MyComplaintsPage from "./pages/MyComplaintsPage";

import StudentDashboard from "./pages/StudentDashboard";
import CreateApplicationPage from "./pages/CreateApplicationPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentApplicationDetailPage from "./pages/StudentApplicationDetailPage";

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
  path="/applications/:id"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <ApplicationDetailPage />
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
  path="/student/notifications"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <NotificationsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/applications/:id"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <StudentApplicationDetailPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/notifications"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <NotificationsPage />
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
  path="/complaints"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <ComplaintsPage />
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
        <Route
  path="/student/complaint"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <CreateComplaintPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/my-complaints"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <MyComplaintsPage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;