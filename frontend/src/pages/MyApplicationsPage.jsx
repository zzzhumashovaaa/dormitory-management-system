import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function MyApplicationsPage() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("ACCOMMODATION");
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/applications", {
        type,
        message,
      });

      setType("ACCOMMODATION");
      setMessage("");
      setShowModal(false);
      fetchApplications();

      alert("Application submitted successfully");
    } catch (error) {
      console.log("CREATE APPLICATION ERROR:", error);

      alert(
        "Failed to create application: " +
          (error.response?.data?.message ||
            error.response?.data ||
            error.message)
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "NEEDS_REVISION":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Applications
          </h1>
          <p className="text-gray-500 mt-1">
            Track your dormitory applications
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          + Create Application
        </button>
      </div>

      <div className="space-y-5">
        {applications.map((application) => (
          <div
            key={application.id}
            onClick={() =>
              navigate(`/student/applications/${application.id}`)
            }
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  Application #{application.id}
                </h2>
                <p className="text-gray-500 mt-1">
                  {application.type}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                  application.status
                )}`}
              >
                {application.status}
              </span>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">
              {application.message}
            </p>

            {application.adminComment && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-orange-700 mb-1">
                  Admin Comment
                </p>
                <p className="text-gray-700 text-sm">
                  {application.adminComment}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-400">
              Created:{" "}
              {application.createdAt
                ? new Date(application.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No applications yet
            </h2>
            <p className="text-gray-500 mb-6">
              You have not submitted any dormitory applications.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              + Create Application
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
                  Create Application
                </h2>
                <p className="text-gray-500 mt-1">
                  Submit a new dormitory application
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACCOMMODATION">Accommodation</option>
                <option value="TRANSFER">Transfer</option>
                <option value="COMPLAINT">Complaint</option>
              </select>

              <textarea
                placeholder="Application text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-gray-200 p-4 rounded-xl h-40 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <div className="flex justify-end gap-3">
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
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}