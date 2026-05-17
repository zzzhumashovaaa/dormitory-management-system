import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import ChatsPage from "./pages/ChatsPage";
import NotificationsPage from "./pages/NotificationsPage";

import StudentDashboard from "./pages/StudentDashboard";
import MyRoomPage from "./pages/MyRoomPage";
import QRAccessPage from "./pages/QRAccessPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyComplaintsPage from "./pages/MyComplaintsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import RoommateProfilePage from "./pages/RoommateProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ADMIN */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route
          path="/notifications"
          element={<NotificationsPage />}
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/my-room"
          element={<MyRoomPage />}
        />

        <Route
          path="/student/qr-access"
          element={<QRAccessPage />}
        />

        <Route
          path="/student/applications"
          element={<MyApplicationsPage />}
        />

        <Route
          path="/student/complaints"
          element={<MyComplaintsPage />}
        />

        <Route
          path="/student/chats"
          element={<ChatsPage />}
        />

        <Route
          path="/student/notifications"
          element={<NotificationsPage />}
        />

        <Route
          path="/student/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/student/settings"
          element={<SettingsPage />}
        />

        <Route
          path="/student/roommates/:id"
          element={<RoommateProfilePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}