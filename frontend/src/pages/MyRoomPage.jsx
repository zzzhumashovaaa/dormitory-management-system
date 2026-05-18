import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function MyRoomPage() {
  const [user, setUser] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoomData = async () => {
    try {
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);

      if (userResponse.data?.room) {
        const roommatesResponse = await api.get("/users/me/roommates");
        setRoommates(roommatesResponse.data || []);
      }
    } catch (error) {
      console.log("MY ROOM ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Loading room information...</p>
        </div>
      </DashboardLayout>
    );
  }

  const room = user?.room;

  if (!room) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Room</h1>
          <p className="text-gray-500">
            Your room will appear here after approval.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            R
          </div>

          <h2 className="text-2xl font-bold mb-2">No room assigned yet</h2>

          <p className="text-gray-500 max-w-xl mx-auto mb-6">
            Submit an application or wait until your current application is approved.
          </p>

          <div className="flex justify-center gap-3">
            <Link
              to="/student/application"
              className="bg-gray-950 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Submit Application
            </Link>

            <Link
              to="/student/my-applications"
              className="border px-5 py-3 rounded-xl font-semibold"
            >
              View Applications
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const occupiedCount = room.occupiedCount || 0;
  const capacity = room.capacity || 1;
  const occupancyPercent = Math.round((occupiedCount / capacity) * 100);
  const availableBeds = Math.max(capacity - occupiedCount, 0);

  return (
    <DashboardLayout>
      <div className="mb-5 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Room</h1>
          <p className="text-gray-500">
            Assigned room, occupancy and roommates.
          </p>
        </div>

        <Link
          to="/student/qr-access"
          className="bg-gray-950 text-white px-4 py-2.5 rounded-xl font-semibold"
        >
          Open QR Access
        </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-sm mb-5">
        <div className="flex justify-between items-center gap-6">
          <div>
            <p className="text-blue-100 mb-1">Assigned Room</p>

            <h2 className="text-4xl font-bold mb-2">
              Room {room.roomNumber}
            </h2>

            <p className="text-blue-100 text-sm">
              {room.gender || "-"} room • {room.status || "-"} • {capacity} beds • {availableBeds} available
            </p>
          </div>

          <div className="bg-white/15 px-5 py-4 rounded-2xl text-center min-w-[130px]">
            <p className="text-blue-100 text-sm">Occupancy</p>

            <h3 className="text-3xl font-bold">
              {occupiedCount}/{capacity}
            </h3>

            <p className="text-blue-100 text-xs">
              {occupancyPercent}% filled
            </p>
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div
            className="bg-white h-2 rounded-full"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-5">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Room Status</p>
            <p className="font-bold text-lg">{room.status}</p>
          </div>

          <div>
            <p className="text-gray-500">Capacity</p>
            <p className="font-bold text-lg">{capacity}</p>
          </div>

          <div>
            <p className="text-gray-500">Available Beds</p>
            <p className="font-bold text-lg">{availableBeds}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Roommates</h2>

            <span className="text-sm text-blue-600 font-medium">
              Real room residents
            </span>
          </div>

          {roommates.length === 0 ? (
            <div className="border rounded-2xl p-5 text-gray-500">
              No roommates yet.
            </div>
          ) : (
            <div className="space-y-3">
              {roommates.map((student) => (
                <div
                  key={student.id}
                  className="border rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                      {student.fullName?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold">
                        {student.fullName}
                      </h4>

                      <p className="text-gray-500 text-sm">
                        {student.email}
                      </p>

                      <div className="flex gap-2 mt-1 text-xs text-gray-500">
                        <span>{student.faculty || "-"}</span>
                        <span>•</span>
                        <span>{student.course || "-"}</span>
                        <span>•</span>
                        <span>{student.sleepType || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Compatibility</p>

                    <h3 className="text-xl font-bold text-purple-600 mb-2">
                      {student.compatibility || 80}%
                    </h3>

                    <Link
                      to={`/student/roommates/${student.id}`}
                      className="inline-block bg-gray-950 text-white px-3 py-2 rounded-xl text-xs font-semibold"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

            <div className="space-y-3">
              <Link
                to="/student/applications"
                className="block border rounded-2xl p-4 hover:bg-gray-50 transition"
              >
                <p className="font-bold">Request Room Change</p>
                <p className="text-gray-500 text-sm">
                  Submit a transfer application.
                </p>
              </Link>

              <Link
                to="/student/complaints"
                className="block border rounded-2xl p-4 hover:bg-gray-50 transition"
              >
                <p className="font-bold">Report Room Issue</p>
                <p className="text-gray-500 text-sm">
                  Send a complaint to administration.
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-gray-950 text-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-3">Room Policy</h2>

            <p className="text-gray-300 text-sm mb-4">
              Keep your room clean, respect quiet hours and follow dormitory rules.
            </p>

            <Link
              to="/student/rules"
              className="inline-block bg-white text-gray-950 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              View Rules
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}