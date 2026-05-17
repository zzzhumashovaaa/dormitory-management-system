import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

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
      <div className="mb-10">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-gray-500 mt-1">
          Track your dormitory applications
        </p>
      </div>

      <div className="space-y-5">
        {applications.map((application) => (
          <div
            key={application.id}
            onClick={() => navigate(`/student/applications/${application.id}`)}
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
              Created: {new Date(application.createdAt).toLocaleString()}
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
              onClick={() => navigate("/student/application")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Create Application
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}