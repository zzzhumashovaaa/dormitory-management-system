import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [applications, setApplications] = useState([]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.log("USER ME ERROR:", error);
    }
  };
  const fetchUnreadNotifications = async () => {
  try {
    const response = await api.get(
      "/notifications/unread-count"
    );

    setUnreadCount(response.data.count);
  } catch (error) {
    console.log("NOTIFICATION COUNT ERROR:", error);
  }
};

  const fetchMyApplications = async () => {
    try {
      const response = await api.get("/applications/my");
      setApplications(response.data);
    } catch (error) {
      console.log("MY APPLICATIONS ERROR:", error);
    }
  };

useEffect(() => {
  fetchCurrentUser();
  fetchUnreadNotifications();
  fetchMyApplications();
}, []);

  const latestApplication = applications[0];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-8">

  <div>
    <h1 className="text-3xl font-bold">
      Student Dashboard
    </h1>

    <p className="text-gray-500">
      Welcome, {user?.fullName || "Student"}
    </p>
  </div>

  <Link
  to="/student/notifications"
  className="relative bg-white shadow p-4 rounded-2xl hover:bg-gray-50 transition"
>
  <span className="text-2xl">🔔</span>

  {unreadCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</Link>

</div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 mb-2">Full Name</p>
          <h2 className="text-2xl font-bold">
            {user?.fullName || "-"}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 mb-2">Email</p>
          <h2 className="text-lg font-bold">
            {user?.email || "-"}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 mb-2">Gender</p>
          <h2 className="text-2xl font-bold">
            {user?.gender || "-"}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-3">
            Dormitory Application
          </h2>

          <p className="text-gray-500 mb-6">
            Submit application for dormitory placement
          </p>

          <Link
            to="/student/application"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Create Application
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-3">
            My Applications
          </h2>

          <p className="text-gray-500 mb-6">
            Track your dormitory requests
          </p>

          <Link
            to="/student/my-applications"
            className="bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            View Applications
          </Link>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow">
  <h2 className="text-2xl font-bold mb-3">
    Complaints
  </h2>

  <p className="text-gray-500 mb-6">
    Submit and track dormitory complaints
  </p>

  <div className="flex gap-3">
    <Link
      to="/student/complaint"
      className="bg-red-600 text-white px-5 py-3 rounded-lg"
    >
      Create
    </Link>

    <Link
      to="/student/my-complaints"
      className="bg-gray-800 text-white px-5 py-3 rounded-lg"
    >
      My Complaints
    </Link>
  </div>
</div>

      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            Assigned Room
          </h2>

          {user?.room ? (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500">Room Number</p>
                <p className="text-2xl font-bold">
                  {user.room.roomNumber}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <p className="text-2xl font-bold">
                  {user.room.status}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Occupancy</p>
                <p className="text-2xl font-bold">
                  {user.room.occupiedCount} / {user.room.capacity}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Gender</p>
                <p className="text-2xl font-bold">
                  {user.room.gender}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              No room assigned yet. Please wait until your application is approved.
            </p>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            Latest Application
          </h2>

          {latestApplication ? (
            <div>
              <p className="text-gray-500 mb-2">Type</p>
              <p className="text-xl font-bold mb-4">
                {latestApplication.type}
              </p>

              <p className="text-gray-500 mb-2">Status</p>
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  latestApplication.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : latestApplication.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {latestApplication.status}
              </span>

              <p className="text-gray-500 mt-6 mb-2">Message</p>
              <p className="text-gray-700">
                {latestApplication.message || "-"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              You have not submitted any applications yet.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}