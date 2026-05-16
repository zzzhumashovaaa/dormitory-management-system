import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      setComplaints(response.data);
    } catch (error) {
      console.log("COMPLAINTS ERROR:", error);
      alert("Failed to load complaints");
    }
  };

  const updateStatus = async (id, status) => {
    const adminResponse = window.prompt("Admin response:");

    try {
      await api.put(`/complaints/${id}/status`, {
        status,
        adminResponse,
      });

      fetchComplaints();
    } catch (error) {
      console.log("UPDATE COMPLAINT ERROR:", error);
      alert("Failed to update complaint");
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
          Review and manage student complaints
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Room</th>
              <th className="p-4">Category</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Response</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="border-t">
                <td className="p-4 font-semibold">
                  {complaint.student?.fullName || "-"}
                </td>

                <td className="p-4">
                  {complaint.room?.roomNumber || "-"}
                </td>

                <td className="p-4">{complaint.category}</td>

                <td className="p-4">
                  <p className="font-semibold">{complaint.title}</p>
                  <p className="text-sm text-gray-500">
                    {complaint.description}
                  </p>
                </td>

                <td className="p-4">{complaint.status}</td>

                <td className="p-4">
                  {complaint.adminResponse || "-"}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus(complaint.id, "IN_PROGRESS")
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(complaint.id, "RESOLVED")
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(complaint.id, "REJECTED")
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {complaints.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No complaints found
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}