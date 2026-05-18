import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function QrScanPage() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  const studentIdFromQr = searchParams.get("studentId");

  const fetchLogs = async () => {
    try {
      const response = await api.get("/access/logs");
      setLogs(response.data || []);
    } catch (error) {
      console.log("ACCESS LOGS ERROR:", error);
    }
  };

  const scanQr = async (studentId) => {
    if (!studentId) {
      setResult({
        error: true,
        message: "Student ID not found in QR code",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/access/scan", {
        studentId,
      });

      setResult(response.data);
      fetchLogs();
    } catch (error) {
      console.log("QR SCAN ERROR:", error);

      setResult({
        error: true,
        message:
          error.response?.data?.message ||
          error.response?.data ||
          "QR Scan Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    if (studentIdFromQr) {
      scanQr(studentIdFromQr);
    }
  }, [studentIdFromQr]);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return logs.filter((log) => {
      return (
        !query ||
        log.studentName?.toLowerCase().includes(query) ||
        log.studentId?.toLowerCase().includes(query) ||
        log.roomNumber?.toLowerCase().includes(query)
      );
    });
  }, [logs, search]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusClass = (status) => {
    if (status === "LATE") return "bg-red-100 text-red-700";
    if (status === "ON_TIME") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const actionClass = (action) => {
    if (action === "ENTRY") return "bg-blue-100 text-blue-700";
    if (action === "EXIT") return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">QR Scan</h1>
        <p className="text-gray-500">
          Register student entry/exit and view scan history
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <p className="text-xl font-bold">Scanning QR...</p>
        </div>
      )}

      {result?.error && (
        <div className="bg-red-100 text-red-700 p-6 rounded-2xl mb-6">
          <p className="font-bold">QR Scan Failed</p>
          <p className="text-sm mt-1">{result.message}</p>
        </div>
      )}

      {result && !result.error && (
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Access Registered</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Student</p>
              <p className="font-bold">{result.studentName || "-"}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Room</p>
              <p className="font-bold">{result.roomNumber || "-"}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Action</p>
              <p className="font-bold text-blue-600">{result.action || "-"}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-bold text-green-600">{result.status || "-"}</p>
            </div>
          </div>
        </div>
      )}

      {!studentIdFromQr && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-5 mb-6">
          Open this page from a student's QR code link to register entry/exit.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">Scan History</h2>

        <input
          className="border rounded-xl p-3 w-full"
          placeholder="Search by student, ID or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Room</th>
              <th className="p-4">Action</th>
              <th className="p-4">Status</th>
              <th className="p-4">Scanned At</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">{log.studentName || "-"}</td>
                <td className="p-4">{log.studentId || "-"}</td>
                <td className="p-4">
                  {log.roomNumber ? `Room ${log.roomNumber}` : "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${actionClass(
                      log.action
                    )}`}
                  >
                    {log.action || "-"}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(
                      log.status
                    )}`}
                  >
                    {log.status || "-"}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {formatDate(log.scannedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No scan history yet
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}