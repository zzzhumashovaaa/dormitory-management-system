import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function DashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [applications, setApplications] = useState([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "AVAILABLE"
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Dormitory management overview
        </p>
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
      </div>
    </DashboardLayout>
  );
}