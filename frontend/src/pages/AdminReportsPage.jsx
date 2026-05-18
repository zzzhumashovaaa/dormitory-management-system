import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function AdminReportsPage() {
  const [reports, setReports] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await api.get("/admin/reports");
      setReports(response.data);
    } catch (error) {
      console.log("REPORTS ERROR:", error);
      alert("Failed to load reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const value = (key) => reports?.[key] ?? 0;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500">
          Dormitory statistics, occupancy and payment overview
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Total Rooms</p>
          <h2 className="text-4xl font-bold">{value("totalRooms")}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Full Rooms</p>
          <h2 className="text-4xl font-bold">{value("fullRooms")}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Available Rooms</p>
          <h2 className="text-4xl font-bold">{value("availableRooms")}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Occupancy Rate</p>
          <h2 className="text-4xl font-bold">
            {Number(value("occupancyRate")).toFixed(1)}%
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Total Students</p>
          <h2 className="text-4xl font-bold">{value("totalStudents")}</h2>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-green-600">With Room</p>
          <h2 className="text-4xl font-bold text-green-700">
            {value("studentsWithRoom")}
          </h2>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <p className="text-orange-600">Without Room</p>
          <h2 className="text-4xl font-bold text-orange-700">
            {value("studentsWithoutRoom")}
          </h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-red-600">Total Debt</p>
          <h2 className="text-3xl font-bold text-red-700">
            ₸ {Number(value("totalDebt")).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="border rounded-2xl p-5">
            <p className="text-gray-500">Total Payments</p>
            <h3 className="text-3xl font-bold">{value("totalPayments")}</h3>
          </div>

          <div className="border rounded-2xl p-5">
            <p className="text-gray-500">Paid Payments</p>
            <h3 className="text-3xl font-bold">{value("paidPayments")}</h3>
          </div>

          <div className="border rounded-2xl p-5">
            <p className="text-gray-500">Unpaid Payments</p>
            <h3 className="text-3xl font-bold">{value("unpaidPayments")}</h3>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}