import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.log("APPLICATIONS ERROR:", error);
      alert("Failed to load applications");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status?status=${status}`);
      fetchApplications();
    } catch (error) {
      console.log("STATUS ERROR:", error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-gray-500">Review and manage student applications</p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Student</th>
              <th className="p-4">Type</th>
              <th className="p-4">Text</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-4">{app.id}</td>
                <td className="p-4 font-semibold">
                  {app.studentName || "Student"}
                </td>
                <td className="p-4">{app.type}</td>
                <td className="p-4">{app.text}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                    {app.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                    <button
                        disabled={
                            app.status === "APPROVED" ||
                            app.status === "REJECTED"
                            }
                        onClick={() => updateStatus(app.id, "APPROVED")}
                        className={`px-3 py-1 rounded-lg text-white ${
                        app.status === "APPROVED"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        Approve
                    </button>

                    <button
                        disabled={
                            app.status === "APPROVED" ||
                            app.status === "REJECTED"
                            }
                        onClick={() => updateStatus(app.id, "REJECTED")}
                        className={`px-3 py-1 rounded-lg text-white ${
                        app.status === "APPROVED"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        Reject
                    </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No applications found
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}