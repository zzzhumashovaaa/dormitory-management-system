import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const [open, setOpen] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(null);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      setUnreadNotifications(response.data.count || 0);
    } catch (error) {
      console.log("SIDEBAR NOTIFICATION COUNT ERROR:", error);
      setUnreadNotifications(0);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();

    const updateListener = () => {
      fetchUnreadNotifications();
    };

    window.addEventListener("notifications-updated", updateListener);

    return () => {
      window.removeEventListener("notifications-updated", updateListener);
    };
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const menuItem = (path, label, icon, badge = null) => {
    const active = location.pathname === path;
    const showBadge = badge !== null && Number(badge) > 0;

    return (
      <Link
        to={path}
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">{icon}</span>
          {open && <span className="text-sm font-medium">{label}</span>}
        </div>

        {open && showBadge && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gray-950 text-white p-4 flex flex-col justify-between transition-all duration-300 ${
        open ? "w-64" : "w-20"
      }`}
    >
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full mb-6 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl"
        >
          {open ? "Close" : "Menu"}
        </button>

        {open && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dormitory</h1>
            <p className="text-sm text-gray-400">
              {role === "STUDENT" ? "Student Panel" : "Admin Panel"}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {role === "STUDENT" ? (
            <>
              {menuItem("/student", "Dashboard", "D")}
              {menuItem("/student/my-room", "My Room", "R")}
              {menuItem("/student/qr-access", "QR Access", "Q")}
              {menuItem("/student/chats", "Chats", "H")}
              {menuItem("/student/application", "Create Application", "A")}
              {menuItem("/student/my-applications", "My Applications", "M")}
              {menuItem("/student/complaint", "Create Complaint", "C")}
              {menuItem("/student/my-complaints", "My Complaints", "L")}
              {menuItem(
                "/student/notifications",
                "Notifications",
                "N",
                unreadNotifications
              )}
              {menuItem("/student/profile", "Profile", "P")}
              {menuItem("/student/settings", "Settings", "S")}
            </>
          ) : (
            <>
              {menuItem("/dashboard", "Dashboard", "D")}
              {menuItem("/rooms", "Rooms", "R")}
              {menuItem("/applications", "Applications", "A")}
              {menuItem("/complaints", "Complaints", "C")}
              {menuItem("/chats", "Chats", "H")}
              {menuItem(
                "/notifications",
                "Notifications",
                "N",
                unreadNotifications
              )}
              {menuItem("/student/settings", "Settings", "S")}
            </>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
      >
        {open ? "Logout" : "X"}
      </button>
    </div>
  );
}