import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setStats(response.data);
    } catch (error) {
      console.log("ADMIN DASHBOARD ERROR:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const value = (key) => stats?.[key] ?? 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">System administration and analytics.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold mt-2">{value("totalUsers")}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {value("students")} students
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500 text-sm">Managers</p>
          <h2 className="text-3xl font-bold mt-2">{value("managers")}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {value("admins")} admins
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500 text-sm">Pending Applications</p>
          <h2 className="text-3xl font-bold mt-2">
            {value("pendingApplications")}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {value("applications")} total
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500 text-sm">Total Debt</p>
          <h2 className="text-2xl font-bold mt-2">
            ₸ {Number(value("totalDebt")).toLocaleString()}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {value("unpaidPayments")} unpaid
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        <Link
          to="/admin/users"
          className="bg-blue-600 text-white p-6 rounded-3xl shadow hover:bg-blue-700 transition"
        >
          <p className="text-blue-100">Manage</p>
          <h2 className="text-2xl font-bold mt-2">Users & Roles</h2>
        </Link>

        <Link
          to="/admin/applications"
          className="bg-white p-6 rounded-3xl shadow hover:bg-gray-50 transition"
        >
          <p className="text-gray-500">Review</p>
          <h2 className="text-2xl font-bold mt-2">Applications</h2>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white p-6 rounded-3xl shadow hover:bg-gray-50 transition"
        >
          <p className="text-gray-500">View</p>
          <h2 className="text-2xl font-bold mt-2">Reports</h2>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-white p-6 rounded-3xl shadow hover:bg-gray-50 transition"
        >
          <p className="text-gray-500">Check</p>
          <h2 className="text-2xl font-bold mt-2">Audit Logs</h2>
        </Link>
      </div>
    </DashboardLayout>
  );
}