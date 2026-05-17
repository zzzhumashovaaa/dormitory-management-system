import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Students",
      value: "248",
      subtitle: "Active residents",
      color: "text-blue-600",
    },
    {
      title: "Occupancy Rate",
      value: "82%",
      subtitle: "164 / 200 beds filled",
      color: "text-green-600",
    },
    {
      title: "Pending Applications",
      value: "12",
      subtitle: "Waiting for review",
      color: "text-orange-600",
    },
    {
      title: "Late Entries",
      value: "5",
      subtitle: "Recorded this week",
      color: "text-red-600",
    },
  ];

  const activities = [
    {
      title: "New dormitory application",
      description: "A student submitted a new placement request.",
      time: "10 min ago",
      type: "Application",
    },
    {
      title: "Late entry recorded",
      description: "Student entered the dormitory after 22:00.",
      time: "35 min ago",
      type: "QR Access",
    },
    {
      title: "Complaint submitted",
      description: "Room maintenance issue reported.",
      time: "1 hour ago",
      type: "Complaint",
    },
    {
      title: "Room assigned",
      description: "Student was assigned to Room 405.",
      time: "2 hours ago",
      type: "Room",
    },
  ];

  const floors = [
    { floor: "1st Floor", occupied: 72 },
    { floor: "2nd Floor", occupied: 88 },
    { floor: "3rd Floor", occupied: 79 },
    { floor: "4th Floor", occupied: 91 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Monitor dormitory operations, applications, rooms and access activity.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 mb-2">{item.title}</p>
            <h2 className={`text-3xl font-bold ${item.color}`}>
              {item.value}
            </h2>
            <p className="text-sm text-gray-400 mt-2">{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-gray-950 to-blue-900 text-white p-8 rounded-3xl shadow">
            <h2 className="text-3xl font-bold mb-3">
              Smart Dormitory Control Center
            </h2>

            <p className="text-gray-300 mb-6 max-w-2xl">
              Manage rooms, review applications, track QR access records and
              monitor student activity from one dashboard.
            </p>

            <div className="flex gap-4">
              <Link
                to="/applications"
                className="bg-white text-gray-950 px-5 py-3 rounded-xl font-semibold"
              >
                Review Applications
              </Link>

              <Link
                to="/rooms"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Manage Rooms
              </Link>

              <Link
                to="/complaints"
                className="bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Open Complaints
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <span className="text-sm text-blue-600 font-medium">
                Live system events
              </span>
            </div>

            <div className="space-y-5">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-5 flex justify-between hover:shadow transition"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {activity.type}
                      </span>
                      <span className="text-sm text-gray-400">
                        {activity.time}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg">{activity.title}</h3>
                    <p className="text-gray-500">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-bold mb-6">Floor Occupancy</h2>

            <div className="space-y-5">
              {floors.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold">{item.floor}</p>
                    <p className="text-gray-500">{item.occupied}%</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${item.occupied}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-5">System Status</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Dormitory</span>
                <span className="font-bold text-green-600">Active</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">QR Access</span>
                <span className="font-bold text-green-600">Online</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Applications</span>
                <span className="font-bold text-orange-600">12 pending</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Complaints</span>
                <span className="font-bold text-red-600">3 open</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-5">Quick Management</h2>

            <div className="space-y-3">
              <Link
                to="/rooms"
                className="block border rounded-2xl p-4 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold">Add / Edit Rooms</h3>
                <p className="text-sm text-gray-500">
                  Manage room capacity and status.
                </p>
              </Link>

              <Link
                to="/applications"
                className="block border rounded-2xl p-4 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold">Process Applications</h3>
                <p className="text-sm text-gray-500">
                  Approve or reject student requests.
                </p>
              </Link>

              <Link
                to="/complaints"
                className="block border rounded-2xl p-4 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold">Handle Complaints</h3>
                <p className="text-sm text-gray-500">
                  Review student complaints.
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-gray-950 text-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-3">
              Smart Allocation
            </h2>

            <p className="text-gray-300 text-sm mb-5">
              Automatic room assignment will match students by gender,
              available beds and lifestyle compatibility.
            </p>

            <button className="w-full bg-white text-gray-950 py-3 rounded-xl font-semibold">
              Run Allocation
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}