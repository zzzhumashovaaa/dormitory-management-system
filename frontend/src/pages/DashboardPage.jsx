import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    try {
      const [
        roomsResponse,
        applicationsResponse,
        complaintsResponse,
        studentsResponse,
        paymentsResponse,
      ] = await Promise.all([
        api.get("/rooms"),
        api.get("/applications"),
        api.get("/complaints"),
        api.get("/admin/students"),
        api.get("/payments"),
      ]);

      setRooms(roomsResponse.data || []);
      setApplications(applicationsResponse.data || []);
      setComplaints(complaintsResponse.data || []);
      setStudents(studentsResponse.data || []);
      setPayments(paymentsResponse.data || []);
    } catch (error) {
      console.log("DASHBOARD ERROR:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRooms = rooms.length;
  const totalStudents = students.length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "FULL" || room.currentOccupancy >= room.capacity
  ).length;

  const availableRooms = rooms.filter(
    (room) => room.status === "ACTIVE" || room.currentOccupancy < room.capacity
  ).length;

  const pendingApplications = applications.filter(
    (app) => app.status === "PENDING"
  );

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "PENDING"
  );

  const unpaidPayments = payments.filter((payment) => payment.status !== "PAID");

  const totalDebt = unpaidPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Real-time overview of dormitory management system
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Students</p>
          <h2 className="text-4xl font-bold">{totalStudents}</h2>
          <p className="text-sm text-gray-400">
            {totalStudents === 0 ? "No students registered yet" : "Registered users"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Rooms</p>
          <h2 className="text-4xl font-bold">{totalRooms}</h2>
          <p className="text-sm text-gray-400">
            {availableRooms} available / {occupiedRooms} full
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Pending Applications</p>
          <h2 className="text-4xl font-bold">{pendingApplications.length}</h2>
          <p className="text-sm text-gray-400">
            {pendingApplications.length === 0 ? "No pending applications" : "Need review"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Debt</p>
          <h2 className="text-3xl font-bold">₸ {totalDebt.toLocaleString()}</h2>
          <p className="text-sm text-gray-400">
            {unpaidPayments.length} unpaid payments
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Latest Applications</h2>
            <Link to="/applications" className="text-blue-600 text-sm">
              View all
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="text-gray-500">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="block border rounded-xl p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {app.student?.fullName || app.user?.fullName || "Student"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.type || "Application"} — {app.createdAt || ""}
                      </p>
                    </div>

                    <span className="text-sm font-semibold">
                      {app.status || "PENDING"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Latest Complaints</h2>
            <Link to="/complaints" className="text-blue-600 text-sm">
              View all
            </Link>
          </div>

          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints yet</p>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 5).map((complaint) => (
                <Link
                  key={complaint.id}
                  to={`/complaints/${complaint.id}`}
                  className="block border rounded-xl p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {complaint.student?.fullName ||
                          complaint.user?.fullName ||
                          "Student"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {complaint.category || "Complaint"} —{" "}
                        {complaint.createdAt || ""}
                      </p>
                    </div>

                    <span className="text-sm font-semibold">
                      {complaint.status || "PENDING"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}