import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StudentPaymentDetailPage from "./pages/StudentPaymentDetailPage";
import RoomsPage from "./pages/RoomsPage";
import PaymentsPage from "./pages/PaymentsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import QrScanPage from "./pages/QrScanPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import ChatsPage from "./pages/ChatsPage";
import NotificationsPage from "./pages/NotificationsPage";

import StudentDashboard from "./pages/StudentDashboard";
import MyRoomPage from "./pages/MyRoomPage";
import QRAccessPage from "./pages/QRAccessPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyComplaintsPage from "./pages/MyComplaintsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import SettingsPage from "./pages/SettingsPage";
import RoommateProfilePage from "./pages/RoommateProfilePage";
import DormitoryRulesPage from "./pages/DormitoryRulesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ComplaintsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ComplaintDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminStudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ChatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-room"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <MyRoomPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/qr-access"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <QRAccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/student/payments/:id"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <StudentPaymentDetailPage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/student/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <MyComplaintsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/chats"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ChatsPage />
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
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/settings"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/payments"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/rules"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <DormitoryRulesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/roommates/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <RoommateProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/qr-scan"
  element={<QrScanPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}