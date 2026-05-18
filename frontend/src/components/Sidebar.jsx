import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Sidebar() {
  const location = useLocation();

  const role = localStorage.getItem("role");
  const normalizedRole = role?.replace("ROLE_", "").toUpperCase() || "";

  const [open, setOpen] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  const isStudent = normalizedRole === "STUDENT";
  const isManager = normalizedRole === "MANAGER";
  const isAdmin = normalizedRole === "ADMIN";

  const fetchUnreadNotifications = async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      setUnreadNotifications(response.data.count || 0);
    } catch (error) {
      console.log("UNREAD NOTIFICATIONS ERROR:", error);
    }
  };

  const fetchUnreadChats = async () => {
    try {
      const response = await api.get("/chats/unread-count");
      setUnreadChats(response.data.count || 0);
    } catch (error) {
      console.log("UNREAD CHATS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    fetchUnreadChats();
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getPanelName = () => {
    if (isStudent) return "Student Panel";
    if (isManager) return "Manager Panel";
    if (isAdmin) return "Admin Panel";
    return "Panel";
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const menuItem = (path, label, icon, badge = null) => {
    const active = isActive(path);

    return (
      <Link
        to={path}
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ${
          active
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">{icon}</span>
          {open && <span className="text-sm font-medium">{label}</span>}
        </div>

        {open && badge > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 text-gray-900 p-4 flex flex-col justify-between transition-all duration-300 overflow-y-auto shadow-sm ${
        open ? "w-64" : "w-20"
      }`}
    >
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full mb-6 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-xl transition"
        >
          {open ? "Close" : "Menu"}
        </button>

        {open && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dormitory</h1>
            <p className="text-sm text-gray-500">{getPanelName()}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {isStudent && (
            <>
              {menuItem("/student", "Dashboard", "D")}
              {menuItem("/student/my-room", "My Room", "R")}
              {menuItem("/student/qr-access", "QR Access", "Q")}
              {menuItem("/student/chats", "Chats", "H", unreadChats)}
              {menuItem("/student/applications", "Applications", "A")}
              {menuItem("/student/complaints", "Complaints", "C")}
              {menuItem("/student/payments", "Payments", "P")}
              {menuItem("/student/notifications", "Notifications", "N", unreadNotifications)}
              {menuItem("/student/profile", "Profile", "U")}
              {menuItem("/student/settings", "Settings", "S")}
            </>
          )}

          {isManager && (
            <>
              {menuItem("/manager/dashboard", "Dashboard", "D")}
              {menuItem("/manager/applications", "Applications", "A")}
              {menuItem("/manager/complaints", "Complaints", "C")}
              {menuItem("/manager/rooms", "Rooms", "R")}
              {menuItem("/manager/students", "Students", "S")}
              {menuItem("/manager/payments", "Payments", "P")}
              {menuItem("/manager/chats", "Chats", "H", unreadChats)}
              {menuItem("/manager/notifications", "Notifications", "N", unreadNotifications)}
              {menuItem("/manager/qr-scan", "QR Scan", "Q")}
            </>
          )}

          {isAdmin && (
            <>
              {menuItem("/admin/dashboard", "Dashboard", "D")}
              {menuItem("/admin/users", "Users & Roles", "U")}
              {menuItem("/admin/students", "Students", "S")}
              {menuItem("/admin/rooms", "Rooms Control", "R")}
              {menuItem("/admin/applications", "Applications Control", "A")}
              {menuItem("/admin/complaints", "Complaints Control", "C")}
              {menuItem("/admin/payments", "Payments Control", "P")}
              {menuItem("/admin/reports", "Reports", "T")}
              {menuItem("/admin/settings", "System Settings", "S")}
              {menuItem("/admin/audit-logs", "Audit Logs", "L")}
            </>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition mt-6"
      >
        {open ? "Logout" : "X"}
      </button>
    </div>
  );
}