import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = async () => {
    try {
      const response = await api.get("/admin/audit-logs");
      setLogs(response.data || []);
    } catch (error) {
      console.log("AUDIT LOGS ERROR:", error);
      alert("Failed to load audit logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.studentName?.toLowerCase().includes(query) ||
        log.studentId?.toLowerCase().includes(query) ||
        log.roomNumber?.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || log.status === statusFilter;
      const matchesAction = !actionFilter || log.action === actionFilter;

      return matchesSearch && matchesStatus && matchesAction;
    });
  }, [logs, search, statusFilter, actionFilter]);

  const lateCount = logs.filter((log) => log.status === "LATE").length;
  const entryCount = logs.filter((log) => log.action === "ENTRY").length;
  const exitCount = logs.filter((log) => log.action === "EXIT").length;

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
    if (status === "LATE") {
      return "bg-red-100 text-red-700";
    }

    if (status === "ON_TIME") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const actionClass = (action) => {
    if (action === "ENTRY") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-purple-100 text-purple-700";
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-gray-500">
          QR access history, entry/exit records and late arrivals
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Total Logs</p>
          <h2 className="text-4xl font-bold">{logs.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Entries</p>
          <h2 className="text-4xl font-bold">{entryCount}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Exits</p>
          <h2 className="text-4xl font-bold">{exitCount}</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-red-600">Late Entries</p>
          <h2 className="text-4xl font-bold text-red-700">{lateCount}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-5">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="border rounded-xl p-3"
            placeholder="Search student, ID or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl p-3"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All actions</option>
            <option value="ENTRY">Entry</option>
            <option value="EXIT">Exit</option>
          </select>

          <select
            className="border rounded-xl p-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="ON_TIME">On time</option>
            <option value="LATE">Late</option>
            <option value="RECORDED">Recorded</option>
          </select>
        </div>
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
                <td className="p-4 font-semibold">
                  {log.studentName || "-"}
                </td>

                <td className="p-4">
                  {log.studentId || "-"}
                </td>

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
            No audit logs found
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}