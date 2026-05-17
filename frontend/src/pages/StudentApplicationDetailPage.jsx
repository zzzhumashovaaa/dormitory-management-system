import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function StudentApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState("");

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${id}`);

      setApplication(response.data);
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const resubmitApplication = async () => {
    try {
      await api.put(`/applications/${id}/resubmit`, {
        message,
      });

      alert("Application resubmitted successfully");

      fetchApplication();
    } catch (error) {
      console.log(error);
      alert("Failed to resubmit");
    }
  };

  if (!application) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              My Application #{application.id}
            </h1>

            <p className="text-gray-500 mt-1">
              Dormitory application details
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold">
            {application.status}
          </span>
        </div>

        {application.adminComment && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h2 className="font-bold text-orange-700 mb-2">
              Admin Comment
            </h2>

            <p className="text-gray-700">
              {application.adminComment}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Application Message
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={application.status !== "NEEDS_REVISION"}
            className="w-full h-40 border rounded-2xl p-5 outline-none"
          />
        </div>

        {application.status === "NEEDS_REVISION" && (
          <button
            onClick={resubmitApplication}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Resubmit Application
          </button>
        )}
      </div>
    </DashboardLayout>
  );
}