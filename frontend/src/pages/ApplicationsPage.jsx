import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.log("APPLICATIONS ERROR:", error);
      alert("Failed to load applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-500 mt-1">
            Review and manage student applications
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm px-5 py-3">
          <p className="text-sm text-gray-500">Total applications</p>
          <p className="text-2xl font-bold">{applications.length}</p>
        </div>
      </div>

      <div className="space-y-5">
        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => navigate(`/applications/${app.id}`)}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between items-start gap-5 mb-5">
              <div>
                <h2 className="text-xl font-bold">
                  Application #{app.id}
                </h2>

                <p className="text-gray-500 mt-1">
                  {app.student?.fullName || "Unknown student"} ·{" "}
                  {app.student?.email || "No email"}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-5 mb-5">
              <div>
                <p className="text-sm text-gray-400">Gender</p>
                <p className="font-semibold">
                  {app.student?.gender || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Type</p>
                <p className="font-semibold">{app.type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Assigned Room</p>
                <p className="font-semibold">
                  {app.student?.room?.roomNumber || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="font-semibold">
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-400 mb-1">Message</p>
              <p className="text-gray-700 line-clamp-2">
                {app.message || "-"}
              </p>
            </div>

            {app.adminComment && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-orange-700 mb-1">
                  Admin Comment
                </p>
                <p className="text-gray-700 line-clamp-2">
                  {app.adminComment}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/applications/${app.id}`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No applications found
            </h2>
            <p className="text-gray-500">
              New student applications will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}