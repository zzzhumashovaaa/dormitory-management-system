import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      setComplaints(response.data || []);
    } catch (error) {
      console.log("COMPLAINTS ERROR:", error);
      alert("Failed to load complaints");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, {
        status,
      });

      fetchComplaints();
    } catch (error) {
      console.log("COMPLAINT STATUS ERROR:", error);
      alert("Failed to update complaint status");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <p className="text-gray-500">
          Click any complaint to open its detail page.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint.id}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-4">
                  <Link
                    to={`/complaints/${complaint.id}`}
                    className="block font-semibold text-blue-700 hover:underline"
                  >
                    {complaint.student?.fullName || "Unknown student"}
                  </Link>

                  <p className="text-sm text-gray-500">
                    {complaint.student?.email || "-"}
                  </p>
                </td>

                <td className="p-4">
                  <Link to={`/complaints/${complaint.id}`} className="block">
                    {complaint.title || "-"}
                  </Link>
                </td>

                <td className="p-4">
                  <Link to={`/complaints/${complaint.id}`} className="block">
                    {complaint.category || "-"}
                  </Link>
                </td>

                <td className="p-4">
                  <Link to={`/complaints/${complaint.id}`} className="block">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        complaint.status === "RESOLVED"
                          ? "bg-green-100 text-green-700"
                          : complaint.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : complaint.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </Link>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(complaint.id, "IN_PROGRESS")}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                    >
                      In progress
                    </button>

                    <button
                      onClick={() => updateStatus(complaint.id, "RESOLVED")}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg"
                    >
                      Resolve
                    </button>

                    <Link
                      to={`/complaints/${complaint.id}`}
                      className="bg-gray-900 text-white px-3 py-2 rounded-lg"
                    >
                      Open
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {complaints.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No complaints found.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}