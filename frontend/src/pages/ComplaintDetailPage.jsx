import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function ComplaintDetailPage() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [reply, setReply] = useState("");

  const fetchComplaint = async () => {
    try {
      const response = await api.get(`/complaints/${id}`);
      setComplaint(response.data);
    } catch (error) {
      console.log("COMPLAINT DETAIL ERROR:", error);
      alert("Failed to load complaint detail");
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.put(`/complaints/${id}/status`, {
        status,
      });

      fetchComplaint();
    } catch (error) {
      console.log("COMPLAINT STATUS ERROR:", error);
      alert("Failed to update complaint status");
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) {
      alert("Write a reply first");
      return;
    }

    try {
      await api.post(`/complaints/${id}/reply`, {
        message: reply,
      });

      setReply("");
      fetchComplaint();
    } catch (error) {
      console.log("COMPLAINT REPLY ERROR:", error);
      alert("Failed to send reply");
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (!complaint) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading complaint...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/complaints" className="text-blue-600 text-sm">
            ← Back to complaints
          </Link>

          <h1 className="text-3xl font-bold mt-2">
            {complaint.title || "Complaint Detail"}
          </h1>

          <p className="text-gray-500">
            Complaint #{complaint.id}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Complaint Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Category</p>
                <p className="font-semibold">{complaint.category || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Message</p>
                <p className="font-semibold whitespace-pre-wrap">
                  {complaint.description || complaint.message || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Created At</p>
                <p className="font-semibold">
                  {complaint.createdAt
                    ? new Date(complaint.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Admin Reply</h2>

            {complaint.reply || complaint.adminReply ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="font-semibold whitespace-pre-wrap">
                  {complaint.reply || complaint.adminReply}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">No reply yet.</p>
            )}

            <textarea
              className="w-full border rounded-xl p-4 min-h-[130px]"
              placeholder="Write reply to student..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <button
              onClick={sendReply}
              className="mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              Send Reply
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Student</h2>

            <p className="font-bold">
              {complaint.student?.fullName || "Unknown student"}
            </p>

            <p className="text-gray-500 text-sm">
              {complaint.student?.email || "-"}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Student ID: {complaint.student?.studentId || "-"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => updateStatus("IN_PROGRESS")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                Mark In Progress
              </button>

              <button
                onClick={() => updateStatus("RESOLVED")}
                className="w-full bg-green-600 text-white py-3 rounded-xl"
              >
                Mark Resolved
              </button>

              <button
                onClick={() => updateStatus("REJECTED")}
                className="w-full bg-red-600 text-white py-3 rounded-xl"
              >
                Reject Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}