import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("ROOM_ISSUE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetStudentName, setTargetStudentName] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/complaints", {
        category,
        title,
        description,
        targetStudentName,
      });

      setCategory("ROOM_ISSUE");
      setTitle("");
      setDescription("");
      setTargetStudentName("");
      setShowModal(false);
      fetchComplaints();

      alert("Complaint submitted successfully");
    } catch (error) {
      console.log("CREATE COMPLAINT ERROR:", error);

      alert(
        "Failed to submit complaint: " +
          (error.response?.data?.message ||
            error.response?.data ||
            error.message)
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Complaints
          </h1>
          <p className="text-gray-500">
            Track your complaint status
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          + Create Complaint
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                <td className="p-4 font-semibold">
                  {complaint.title}
                </td>
                <td className="p-4">
                  {complaint.room?.roomNumber || "-"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="p-4">
                  {complaint.adminResponse || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {complaints.length === 0 && (
          <div className="p-14 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No complaints yet
            </h2>
            <p className="text-gray-500 mb-6">
              You have not submitted any complaints.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              + Create Complaint
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Create Complaint
                </h2>
                <p className="text-gray-500 mt-1">
                  Submit a dormitory-related complaint
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <select
                className="border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="ROOM_ISSUE">Room Issue</option>
                <option value="NEIGHBOR_COMPLAINT">
                  Neighbor Complaint
                </option>
                <option value="CLEANLINESS">Cleanliness</option>
                <option value="PAYMENT_ISSUE">Payment Issue</option>
                <option value="SAFETY">Safety</option>
                <option value="OTHER">Other</option>
              </select>

              {category === "NEIGHBOR_COMPLAINT" && (
                <input
                  type="text"
                  placeholder="Target student name"
                  className="border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={targetStudentName}
                  onChange={(e) =>
                    setTargetStudentName(e.target.value)
                  }
                />
              )}

              <input
                type="text"
                placeholder="Title"
                className="border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Description"
                className="border border-gray-200 p-4 rounded-xl min-h-[140px] outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}