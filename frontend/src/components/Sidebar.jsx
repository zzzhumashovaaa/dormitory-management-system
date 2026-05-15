import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItem = (path, label) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        className={`px-4 py-3 rounded-lg transition ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="w-64 min-h-screen bg-gray-950 text-white p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dormitory</h1>
        <p className="text-sm text-gray-400 mb-8">Admin Panel</p>

        <div className="flex flex-col gap-3">
          {menuItem("/dashboard", "Dashboard")}
          {menuItem("/rooms", "Rooms")}
          {menuItem("/applications", "Applications")}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}