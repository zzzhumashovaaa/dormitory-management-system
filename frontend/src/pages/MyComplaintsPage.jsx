import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints/my");
      setComplaints(response.data);
    } catch (error) {
      console.log("MY COMPLAINTS ERROR:", error);
      alert("Failed to load complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Complaints</h1>
        <p className="text-gray-500">
          Track your complaint status
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Title</th>
              <th className="p-4">Room</th>
              <th className="p-4">Status</th>
              <th className="p-4">Admin Response</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="border-t">
                <td className="p-4">{complaint.category}</td>
                <td className="p-4 font-semibold">{complaint.title}</td>
                <td className="p-4">
                  {complaint.room?.roomNumber || "-"}
                </td>
                <td className="p-4">{complaint.status}</td>
                <td className="p-4">
                  {complaint.adminResponse || "-"}
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