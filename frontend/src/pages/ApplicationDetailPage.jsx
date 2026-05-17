import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [adminComment, setAdminComment] = useState("");   

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.log("APPLICATION DETAIL ERROR:", error);
      alert("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      await fetchApplication();
    } catch (error) {
      console.log("STATUS ERROR:", error);
      alert(
        "Failed to update status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading application...</p>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Application not found</p>
      </DashboardLayout>
    );
  }
  const requestChanges = async () => {
  if (!adminComment.trim()) {
    alert("Please write a comment");
    return;
  }

  try {
    await api.put(`/applications/${id}/request-changes`, {
      adminComment,
    });

    setShowRevisionModal(false);
    setAdminComment("");
    await fetchApplication();
  } catch (error) {
  console.log("REQUEST CHANGES ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);

  alert(
    "Failed: " +
      error.response?.status +
      " | " +
      (error.response?.data?.message || error.message)
  );
}
};

  const isFinal =
    application.status === "APPROVED" ||
    application.status === "REJECTED";

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-black"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Application #{application.id}
            </h1>
            <p className="text-gray-500 mt-1">
              Review student dormitory request
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            {application.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-400">Student</p>
            <p className="font-semibold">
              {application.student?.fullName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-semibold">
              {application.student?.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Gender</p>
            <p className="font-semibold">
              {application.student?.gender || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="font-semibold">
              {application.type}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Assigned Room</p>
            <p className="font-semibold">
              {application.student?.room?.roomNumber || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Created At</p>
            <p className="font-semibold">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">Application Message</p>
          <div className="bg-gray-50 rounded-xl p-5 text-gray-700">
            {application.message}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            disabled={isFinal}
            onClick={() => updateStatus("APPROVED")}
            className={`px-5 py-3 rounded-xl text-white ${
              isFinal
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Approve
          </button>

          <button
            disabled={isFinal}
            onClick={() => updateStatus("REJECTED")}
            className={`px-5 py-3 rounded-xl text-white ${
              isFinal
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Reject
          </button>

          <button
  disabled={isFinal}
  onClick={() => setShowRevisionModal(true)}
  className={`px-5 py-3 rounded-xl ${
    isFinal
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-600 text-white"
  }`}
>
  Request Changes
</button>
        </div>
      </div>
      {showRevisionModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-2">
        Request Changes
      </h2>

      <p className="text-gray-500 mb-5">
        Write what the student should fix in the application.
      </p>

      <textarea
        value={adminComment}
        onChange={(e) => setAdminComment(e.target.value)}
        placeholder="Example: Please clarify your reason for accommodation request..."
        className="w-full h-36 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={() => setShowRevisionModal(false)}
          className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={requestChanges}
          className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
        >
          Send to Student
        </button>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}