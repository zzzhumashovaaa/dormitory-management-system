import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications/my");
      setApplications(response.data);
    } catch (error) {
      console.log("MY APPLICATIONS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Applications
        </h1>

        <p className="text-gray-500">
          Track your dormitory requests
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Message</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-4 font-medium">
                  {app.type}
                </td>

                <td className="p-4">
                  {app.message}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      app.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : app.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="p-4 text-gray-500">
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "-"}
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