import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { QRCodeSVG } from "qrcode.react";
import api from "../api/axios";

export default function QRAccessPage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastAccess, setLastAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.log("QR USER ERROR:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get("/access/my-history");
      setHistory(response.data || []);
      setLastAccess(response.data?.[0] || null);
    } catch (error) {
      console.log("ACCESS HISTORY ERROR:", error);
    }
  };

  const simulateScan = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const studentIdentifier = user.studentId || user.id;

      const response = await api.post("/access/scan", {
        studentId: studentIdentifier,
      });

      setLastAccess(response.data);
      await fetchHistory();
    } catch (error) {
      console.log("SIMULATE SCAN ERROR:", error);
      alert("Failed to register access");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchHistory();
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-3xl shadow">
          Loading QR data...
        </div>
      </DashboardLayout>
    );
  }

  const studentName = user.fullName || "Student";
  const studentId = user.studentId || user.id;
  const roomNumber = user.room?.roomNumber || "Not assigned";
  const qrData = `DORM_ACCESS:${studentId}`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColor = (status) => {
    if (status === "LATE") return "text-red-600";
    if (status === "ON_TIME") return "text-green-600";
    return "text-blue-600";
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QR Access</h1>
        <p className="text-gray-500">
          Use your personal QR code to enter or exit the dormitory.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-bold mb-6">My Dormitory QR Code</h2>

          <div className="flex items-center gap-10">
            <div className="bg-gray-100 p-8 rounded-3xl flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl shadow">
                <QRCodeSVG
                  value={qrData}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{studentName}</h3>

              <p className="text-gray-500 mb-1">Student ID: {studentId}</p>
              <p className="text-gray-500 mb-1">Room: {roomNumber}</p>
              <p className="text-gray-500 mb-6">Access type: Entry / Exit</p>

              <div className="bg-blue-50 text-sm text-blue-700 p-4 rounded-2xl mb-5">
                For local demo, click the button below. The system will
                automatically decide whether this is ENTRY or EXIT.
              </div>

              <button
                onClick={simulateScan}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Registering..." : "Simulate QR Scan"}
              </button>

              {lastAccess && (
                <div className="mt-5 bg-gray-50 p-4 rounded-2xl">
                  <p className="text-gray-500 text-sm">Last action</p>
                  <h3 className="text-xl font-bold">
                    {lastAccess.action} —{" "}
                    <span className={statusColor(lastAccess.status)}>
                      {lastAccess.status}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatDate(lastAccess.scannedAt)} {formatTime(lastAccess.scannedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-4">Today’s Access</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Last action</p>
                <h3 className="font-bold text-lg">
                  {lastAccess?.action || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Time</p>
                <h3 className="font-bold text-lg">
                  {formatTime(lastAccess?.scannedAt)}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <h3
                  className={`font-bold ${
                    lastAccess ? statusColor(lastAccess.status) : "text-gray-400"
                  }`}
                >
                  {lastAccess?.status || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Dormitory closes at</p>
                <h3 className="font-bold text-lg">22:00</h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 text-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-3">Access Rule</h2>
            <p className="text-gray-300 text-sm">
              Entry after 22:00 may be marked as late and saved in access
              history.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">Access History</h2>

        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Action</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No access records yet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">{formatDate(item.scannedAt)}</td>
                    <td className="p-4">{formatTime(item.scannedAt)}</td>
                    <td className="p-4">{item.action}</td>
                    <td className={`p-4 font-semibold ${statusColor(item.status)}`}>
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}