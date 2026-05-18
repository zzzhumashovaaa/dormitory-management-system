import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [myRoom, setMyRoom] = useState(null);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/users/me"),
        api.get("/applications/my"),
        api.get("/complaints/my"),
        api.get("/payments/my"),
        api.get("/notifications/my"),
      ]);

      if (results[0].status === "fulfilled") {
        setUser(results[0].value.data);
        setMyRoom(results[0].value.data?.room || null);
      }

      setApplications(results[1].status === "fulfilled" ? results[1].value.data || [] : []);
      setComplaints(results[2].status === "fulfilled" ? results[2].value.data || [] : []);
      setPayments(results[3].status === "fulfilled" ? results[3].value.data || [] : []);
      setNotifications(results[4].status === "fulfilled" ? results[4].value.data || [] : []);
    } catch (error) {
      console.log("STUDENT DASHBOARD ERROR:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const userName = user?.fullName || "Student";
  const unpaidPayments = payments.filter((payment) => payment.status !== "PAID");
  const latestApplication = applications[applications.length - 1];
  const openComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "PENDING" || complaint.status === "IN_PROGRESS"
  );

  const nextPayment = useMemo(() => {
    if (unpaidPayments.length === 0) return null;

    return unpaidPayments.sort((a, b) =>
      String(a.dueDate || "").localeCompare(String(b.dueDate || ""))
    )[0];
  }, [unpaidPayments]);

  const cards = [
    {
      title: "My Room",
      value: myRoom?.roomNumber ? `Room ${myRoom.roomNumber}` : "Not assigned",
      subtitle: myRoom?.capacity ? `Capacity: ${myRoom.capacity}` : "No room data yet",
      color: "text-blue-600",
    },
    {
      title: "Application Status",
      value: latestApplication?.status || "No application",
      subtitle: latestApplication ? "Latest application" : "Create your first application",
      color: "text-orange-600",
    },
    {
      title: "Unpaid Payments",
      value: unpaidPayments.length,
      subtitle:
        unpaidPayments.length === 0
          ? "No debt"
          : `Next: ₸ ${Number(nextPayment?.amount || 0).toLocaleString()}`,
      color: "text-red-600",
    },
    {
      title: "Open Complaints",
      value: openComplaints.length,
      subtitle: openComplaints.length === 0 ? "No active complaints" : "Waiting for response",
      color: "text-purple-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
        <p className="text-gray-500">
          Here is your real dormitory information and latest updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 mb-2">{card.title}</p>
            <h2 className={`text-2xl font-bold ${card.color}`}>{card.value}</h2>
            <p className="text-sm text-gray-400 mt-2">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Dormitory Life Portal
                </h2>

                <p className="text-blue-100 mb-5 max-w-2xl">
                  Manage your room, applications, QR access, payments and dormitory updates in one place.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/student/my-room"
                    className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold"
                  >
                    My Room
                  </Link>

                  <Link
                    to="/student/applications"
                    className="bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Applications
                  </Link>

                  <Link
                    to="/student/qr-access"
                    className="bg-gray-950 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Open QR Code
                  </Link>
                </div>
              </div>

              <div className="hidden md:block bg-white/20 rounded-3xl p-5 text-center min-w-[150px]">
                <p className="text-sm text-blue-100">Status</p>
                <h3 className="text-2xl font-bold">
                  {myRoom ? "Resident" : "Applicant"}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-bold">My Latest Applications</h2>

              <Link
                to="/student/applications"
                className="text-sm text-blue-600 font-medium"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {applications.length === 0 && (
                <p className="text-gray-500">You have not created applications yet.</p>
              )}

              {applications.slice(-3).reverse().map((app) => (
                <Link
                  key={app.id}
                  to={`/student/applications/${app.id}`}
                  className="block border rounded-2xl p-4 hover:bg-blue-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{app.type || "Dormitory application"}</h3>
                      <p className="text-sm text-gray-500">
                        {app.faculty || "-"} · Course {app.course || "-"}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-blue-600">
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-bold">Notifications</h2>

              <Link
                to="/student/notifications"
                className="text-sm text-blue-600 font-medium"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {notifications.length === 0 && (
                <p className="text-gray-500">No notifications yet.</p>
              )}

              {notifications.slice(-4).reverse().map((item) => (
                <div key={item.id} className="border rounded-2xl p-4">
                  <h3 className="font-bold">{item.title || "Notification"}</h3>
                  <p className="text-sm text-gray-500">
                    {item.message || item.text || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-5">Payment Status</h2>

            {nextPayment ? (
              <div>
                <p className="text-gray-500 text-sm">Next unpaid payment</p>
                <h3 className="text-3xl font-bold text-red-600 mt-2">
                  ₸ {Number(nextPayment.amount || 0).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Due date: {nextPayment.dueDate || "-"}
                </p>

                <Link
                  to="/student/payments"
                  className="block text-center mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold"
                >
                  View Payments
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">You have no unpaid payments.</p>
            )}
          </div>

          <div className="bg-white p-7 rounded-3xl shadow">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-bold">Dormitory Rules</h2>

              <Link
                to="/student/rules"
                className="text-sm text-blue-600 font-medium"
              >
                View all
              </Link>
            </div>

            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Quiet hours start at 22:00.</li>
              <li>Visitors must be registered at reception.</li>
              <li>Keep shared areas clean.</li>
              <li>Report technical issues immediately.</li>
            </ul>
          </div>

          <div className="bg-gray-950 text-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-3">Need Help?</h2>
            <p className="text-gray-300 text-sm mb-5">
              Contact the dormitory administration or submit a complaint.
            </p>

            <Link
              to="/student/complaints"
              className="block text-center bg-white text-gray-950 py-3 rounded-xl font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}