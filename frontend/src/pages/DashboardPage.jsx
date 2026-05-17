import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function DashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = async () => {
    try {
      const roomsResponse = await api.get("/rooms");
      const applicationsResponse = await api.get("/applications");

      setRooms(roomsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.log("DASHBOARD ERROR:", error);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      setUnreadCount(response.data.count);
    } catch (error) {
      console.log("NOTIFICATION ERROR:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUnreadNotifications();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "ACTIVE"
  ).length;

  const fullRooms = rooms.filter(
    (room) => room.status === "FULL"
  ).length;

  const pendingApplications = applications.filter(
    (app) => app.status === "PENDING"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "APPROVED"
  ).length;

  const rejectedApplications = applications.filter(
    (app) => app.status === "REJECTED"
  ).length;

  const totalBeds = rooms.reduce(
    (sum, room) => sum + (room.capacity || 0),
    0
  );

  const occupiedBeds = rooms.reduce(
    (sum, room) => sum + (room.occupiedCount || 0),
    0
  );

  const occupancyRate =
    totalBeds === 0 ? 0 : Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500">
            Dormitory management overview
          </p>
        </div>

        <Link
          to="/notifications"
          className="relative bg-white shadow p-4 rounded-2xl hover:bg-gray-50 transition"
        >
          <span className="text-2xl">
            🔔
          </span>

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Total Rooms
          </p>

          <h2 className="text-4xl font-bold">
            {totalRooms}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Available Rooms
          </p>

          <h2 className="text-4xl font-bold text-green-600">
            {availableRooms}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Full Rooms
          </p>

          <h2 className="text-4xl font-bold text-red-600">
            {fullRooms}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Total Applications
          </p>

          <h2 className="text-4xl font-bold">
            {applications.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Pending Applications
          </p>

          <h2 className="text-4xl font-bold text-yellow-500">
            {pendingApplications}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Approved Applications
          </p>

          <h2 className="text-4xl font-bold text-blue-600">
            {approvedApplications}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Rejected Applications
          </p>

          <h2 className="text-4xl font-bold text-gray-700">
            {rejectedApplications}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Total Beds
          </p>

          <h2 className="text-4xl font-bold text-indigo-600">
            {totalBeds}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">
            Occupied Beds
          </p>

          <h2 className="text-4xl font-bold text-orange-600">
            {occupiedBeds}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow col-span-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-500">
              Occupancy Rate
            </p>

            <p className="font-bold">
              {occupancyRate}%
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}