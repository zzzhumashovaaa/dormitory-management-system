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
        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-500">Loading room information...</p>
        </div>
      </DashboardLayout>
    );
  }

  const room = user?.room;

  if (!room) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Room</h1>
          <p className="text-gray-500">
            Your room will appear here after the administration approves your application.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 text-3xl font-bold">
            🏠
          </div>

          <h2 className="text-2xl font-bold mb-3">No room assigned yet</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-6">
            Submit a dormitory application or wait until your current application is approved.
            After approval, the system will automatically assign you to an available room.
          </p>

          <div className="flex justify-center gap-4">
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
              View My Applications
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
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Room</h1>
          <p className="text-gray-500">
            View your real assigned room, occupancy and roommates.
          </p>
        </div>

        <Link
          to="/student/qr-access"
          className="bg-gray-950 text-white px-5 py-3 rounded-xl font-semibold"
        >
          Open QR Access
        </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-3xl shadow mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100 mb-2">Assigned Room</p>
            <h2 className="text-5xl font-bold mb-3">Room {room.roomNumber}</h2>
            <p className="text-blue-100">
              {room.gender || "-"} room • {room.status || "-"}
            </p>
          </div>

          <div className="bg-white/15 p-6 rounded-2xl text-center min-w-[180px]">
            <p className="text-blue-100 mb-1">Occupancy</p>
            <h3 className="text-4xl font-bold">
              {occupiedCount}/{capacity}
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              {occupancyPercent}% filled
            </p>
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-3 mt-4">
          <div
            className="bg-white h-3 rounded-full"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 mb-2">Room Status</p>
          <h2 className="text-3xl font-bold">{room.status}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 mb-2">Capacity</p>
          <h2 className="text-3xl font-bold">{capacity}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 mb-2">Available Beds</p>
          <h2 className="text-3xl font-bold">{availableBeds}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-3xl shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold">Roommates</h2>
            <span className="text-sm text-blue-600 font-medium">
              Real room residents
            </span>
          </div>

          {roommates.length === 0 ? (
            <div className="border rounded-2xl p-6 text-gray-500">
              No roommates yet. They will appear here when other students are assigned to this room.
            </div>
          ) : (
            <div className="space-y-5">
              {roommates.map((student) => (
                <div
                  key={student.id}
                  className="border rounded-2xl p-5 flex items-center justify-between hover:shadow transition"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl">
                      {student.fullName?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h4 className="text-xl font-bold">{student.fullName}</h4>
                      <p className="text-gray-500">{student.email}</p>

                      <div className="flex gap-3 mt-1 text-sm text-gray-600">
                        <span>{student.faculty || "-"}</span>
                        <span>•</span>
                        <span>{student.course || "-"}</span>
                        <span>•</span>
                        <span>{student.sleepType || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Compatibility</p>
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">
                      {student.compatibility || 80}%
                    </h3>

                    <Link
                      to={`/student/roommates/${student.id}`}
                      className="inline-block bg-gray-950 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-5">Quick Actions</h2>

            <div className="space-y-3">
              <Link
                to="/student/application"
                className="block border rounded-2xl p-4 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold">Request Room Change</h3>
                <p className="text-sm text-gray-500">
                  Submit a transfer application.
                </p>
              </Link>

              <Link
                to="/student/complaint"
                className="block border rounded-2xl p-4 hover:bg-blue-50 transition"
              >
                <h3 className="font-bold">Report Room Issue</h3>
                <p className="text-sm text-gray-500">
                  Send a complaint to administration.
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-gray-950 text-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-3">Room Policy</h2>
            <p className="text-gray-300 text-sm">
              Students are responsible for cleanliness, quiet hours and shared
              room property. Room changes must be approved by administration.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
