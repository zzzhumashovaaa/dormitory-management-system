import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import StudentDashboard from "./pages/StudentDashboard";
import MyRoomPage from "./pages/MyRoomPage";
import QRAccessPage from "./pages/QRAccessPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyComplaintsPage from "./pages/MyComplaintsPage";
import PaymentsPage from "./pages/PaymentsPage";
import StudentPaymentDetailPage from "./pages/StudentPaymentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import RoommateProfilePage from "./pages/RoommateProfilePage";
import DormitoryRulesPage from "./pages/DormitoryRulesPage";

import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

import RoomsPage from "./pages/RoomsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import ChatsPage from "./pages/ChatsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import QrScanPage from "./pages/QrScanPage";

import AdminUsersPage from "./pages/AdminUsersPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminSystemSettingsPage from "./pages/AdminSystemSettingsPage";
import AdminAuditLogsPage from "./pages/AdminAuditLogsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
          path="/student/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ComplaintDetailPage />
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
          path="/student/payments/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentPaymentDetailPage />
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

        {/* MANAGER */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/applications"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/complaints"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ComplaintsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ComplaintDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/rooms"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/students"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <AdminStudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/payments"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/chats"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ChatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/notifications"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/qr-scan"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <QrScanPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsersPage />
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
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ComplaintsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ComplaintDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/chats"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ChatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/qr-scan"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <QrScanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminSystemSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* OLD ROUTES REDIRECT */}
        <Route path="/applications" element={<Navigate to="/manager/applications" />} />
        <Route path="/complaints" element={<Navigate to="/manager/complaints" />} />
        <Route path="/rooms" element={<Navigate to="/manager/rooms" />} />
        <Route path="/payments" element={<Navigate to="/manager/payments" />} />
        <Route path="/chats" element={<Navigate to="/manager/chats" />} />
        <Route path="/notifications" element={<Navigate to="/manager/notifications" />} />
        <Route path="/qr-scan" element={<Navigate to="/manager/qr-scan" />} />
      </Routes>
    </BrowserRouter>
  );
}