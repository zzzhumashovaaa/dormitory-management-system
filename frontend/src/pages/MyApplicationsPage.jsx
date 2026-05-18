import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function MyApplicationsPage() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("ACCOMMODATION");
  const [message, setMessage] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications/my");
      setApplications(response.data);
    } catch (error) {
      console.log("MY APPLICATIONS ERROR:", error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await api.get("/roommate-matching/suggestions");
      setSuggestions(response.data);
    } catch (error) {
      console.log("ROOMMATE SUGGESTIONS ERROR:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openCreateModal = () => {
    setShowModal(true);
    fetchSuggestions();
  };

  const closeModal = () => {
    setShowModal(false);
    setType("ACCOMMODATION");
    setMessage("");
    setSelectedSuggestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/applications", {
        type,
        message,
        preferredRoomId: selectedSuggestion?.roomId || null,
        preferredRoomNumber: selectedSuggestion?.roomNumber || null,
        preferredRoommateId: selectedSuggestion?.roommateId || null,
        preferredRoommateName: selectedSuggestion?.roommateName || null,
        compatibilityScore: selectedSuggestion?.compatibilityScore || null,
        matchingFactors: selectedSuggestion?.factors || null,
      });

      closeModal();
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

  const getScoreStyle = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 65) return "bg-blue-100 text-blue-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
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
          onClick={openCreateModal}
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

            {application.preferredRoomNumber && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-blue-700 mb-1">
                  Selected AI Roommate Suggestion
                </p>
                <p className="text-sm text-gray-700">
                  Room {application.preferredRoomNumber}
                  {application.preferredRoommateName &&
                    ` with ${application.preferredRoommateName}`}
                  {application.compatibilityScore &&
                    ` • ${application.compatibilityScore}% compatibility`}
                </p>
              </div>
            )}

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
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              + Create Application
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Create Application
                </h2>
                <p className="text-gray-500 mt-1">
                  Submit a new dormitory application and choose AI roommate suggestion
                </p>
              </div>

              <button
                onClick={closeModal}
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
                className="border border-gray-200 p-4 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {type === "ACCOMMODATION" && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        AI Roommate Suggestions
                      </h3>
                      <p className="text-sm text-gray-500">
                        Choose a preferred room or leave it to admin
                      </p>
                    </div>

                    {selectedSuggestion && (
                      <button
                        type="button"
                        onClick={() => setSelectedSuggestion(null)}
                        className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                      >
                        Clear choice
                      </button>
                    )}
                  </div>

                  {loadingSuggestions ? (
                    <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                      Loading suggestions...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                      No suggestions available. Admin will assign a room automatically.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestions.map((suggestion) => {
                        const isSelected =
                          selectedSuggestion?.roomId === suggestion.roomId;

                        return (
                          <button
                            key={`${suggestion.roomId}-${suggestion.roommateId || "empty"}`}
                            type="button"
                            onClick={() => setSelectedSuggestion(suggestion)}
                            className={`text-left rounded-2xl border p-5 transition bg-white ${
                              isSelected
                                ? "border-blue-500 ring-2 ring-blue-100 shadow-md"
                                : "border-gray-100 hover:border-blue-200 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-3 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Room
                                </p>
                                <h4 className="text-xl font-bold text-gray-900">
                                  {suggestion.roomNumber}
                                </h4>
                              </div>

                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreStyle(
                                  suggestion.compatibilityScore
                                )}`}
                              >
                                {suggestion.compatibilityScore}%
                              </span>
                            </div>

                            <p className="font-semibold text-gray-800 mb-3">
                              {suggestion.roommateName}
                            </p>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Sleep</span>
                                <span className="font-medium text-gray-700">
                                  {suggestion.sleepMatch}
                                </span>
                              </div>

                              <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Cleanliness</span>
                                <span className="font-medium text-gray-700">
                                  {suggestion.cleanlinessMatch}
                                </span>
                              </div>

                              <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Noise</span>
                                <span className="font-medium text-gray-700">
                                  {suggestion.noiseMatch}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-400 mt-4">
                              {suggestion.factors}
                            </p>

                            {isSelected && (
                              <div className="mt-4 bg-blue-50 text-blue-700 rounded-xl px-4 py-2 text-sm font-semibold text-center">
                                Selected
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div
                    onClick={() => setSelectedSuggestion(null)}
                    className={`mt-4 rounded-2xl border p-4 cursor-pointer transition ${
                      selectedSuggestion === null
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 bg-white hover:border-blue-200"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      No preference
                    </p>
                    <p className="text-sm text-gray-500">
                      Let admin assign the most suitable room automatically.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
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