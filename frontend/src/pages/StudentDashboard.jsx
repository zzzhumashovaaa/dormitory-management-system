import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const userName = localStorage.getItem("fullName") || "Student";

  const announcements = [
    {
      title: "Water supply maintenance",
      date: "Today, 18:00",
      text: "Water supply may be unavailable for 1 hour due to scheduled maintenance.",
    },
    {
      title: "Dormitory cleaning inspection",
      date: "Tomorrow, 10:00",
      text: "Please keep your rooms clean before the inspection.",
    },
    {
      title: "Student community evening",
      date: "Friday, 19:00",
      text: "Join the dormitory community event in the main hall.",
    },
  ];

  const events = [
    {
      title: "Payment deadline",
      location: "Dormitory fee",
      time: "May 25, 18:00",
    },
    {
      title: "Room inspection",
      location: "All floors",
      time: "Tomorrow, 10:00",
    },
    {
      title: "Movie Night",
      location: "Common Room",
      time: "Friday, 20:00",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
        <p className="text-gray-500">
          Here is what is happening in your dormitory today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Dormitory Life Portal
                </h2>

                <p className="text-blue-100 mb-5 max-w-2xl">
                  Manage your room, applications, QR access and dormitory
                  updates in one place.
                </p>

                <div className="flex gap-3">
                  <Link
                    to="/student/my-room"
                    className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold"
                  >
                    My Room
                  </Link>

                  <Link
                    to="/student/application"
                    className="bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Apply
                  </Link>

                  <Link
                    to="/student/qr-access"
                    className="bg-gray-950 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Open QR Code
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block bg-white/15 p-5 rounded-2xl min-w-[170px] text-center">
                <div className="bg-white text-gray-950 rounded-xl p-5 mb-3">
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-sm ${
                          index % 2 === 0 ? "bg-gray-950" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-blue-100">
                  Scan for dormitory entry
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Dormitory Announcements</h2>
              <span className="text-sm text-blue-600 font-medium">
                Latest updates
              </span>
            </div>

            <div className="space-y-5">
              {announcements.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow transition"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>

                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

            <div className="grid grid-cols-3 gap-4">
              <Link
                to="/student/application"
                className="border rounded-2xl p-5 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold mb-2">Apply for Room</h3>
                <p className="text-sm text-gray-500">
                  Submit a dormitory placement request.
                </p>
              </Link>

              <Link
                to="/student/complaint"
                className="border rounded-2xl p-5 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold mb-2">Submit Complaint</h3>
                <p className="text-sm text-gray-500">
                  Report room or dormitory issues.
                </p>
              </Link>

              <Link
                to="/student/my-room"
                className="border rounded-2xl p-5 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold mb-2">Room Details</h3>
                <p className="text-sm text-gray-500">
                  View your room and roommates.
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-5">Upcoming Events</h2>

            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.location}</p>
                  <p className="text-sm text-blue-600 font-medium">
                    {event.time}
                  </p>
                </div>
              ))}
            </div>
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
              to="/student/complaint"
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