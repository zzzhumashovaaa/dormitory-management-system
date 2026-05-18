import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data || []);
    } catch (error) {
      console.log("APPLICATIONS ERROR:", error);
      alert("Failed to load applications");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, {
        status,
      });

      fetchApplications();
    } catch (error) {
      console.log("STATUS ERROR:", error);
      alert(
        "Failed to update status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-gray-500">
          Click any application to open its detail page.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Faculty</th>
              <th className="p-4">Course</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-4">
                  <Link
                    to={`/applications/${app.id}`}
                    className="block font-semibold text-blue-700 hover:underline"
                  >
                    {app.student?.fullName || app.fullName || "Unknown student"}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {app.student?.email || "-"}
                  </p>
                </td>

                <td className="p-4">
                  <Link to={`/applications/${app.id}`} className="block">
                    {app.faculty || "-"}
                  </Link>
                </td>

                <td className="p-4">
                  <Link to={`/applications/${app.id}`} className="block">
                    {app.course || "-"}
                  </Link>
                </td>

                <td className="p-4">
                  <Link to={`/applications/${app.id}`} className="block">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : app.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </Link>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(app.id, "APPROVED")}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      Reject
                    </button>

                    <Link
                      to={`/applications/${app.id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                    >
                      Open
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No applications found.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}