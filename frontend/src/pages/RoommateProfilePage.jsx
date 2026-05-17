import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RoommateProfilePage() {
  const { id } = useParams();

  const [roommate, setRoommate] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchRoommate = async () => {
    try {
      const response = await api.get("/users/me/roommates");

      const foundRoommate = response.data.find(
        (student) => student.id === id
      );

      setRoommate(foundRoommate);
    } catch (error) {
      console.log("ROOMMATE ERROR:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/roommate-reviews/${id}`);
      setReviews(response.data || []);
    } catch (error) {
      console.log("REVIEWS ERROR:", error);
    }
  };

  const submitReview = async () => {
    try {
      await api.post(`/roommate-reviews/${id}`, {
        rating,
        comment,
      });

      setShowModal(false);
      setComment("");
      setRating(5);

      fetchReviews();
    } catch (error) {
      console.log("CREATE REVIEW ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    }
  };

  useEffect(() => {
    fetchRoommate();
    fetchReviews();
  }, [id]);

  if (!roommate) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-500">
            Loading roommate profile...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Link
          to="/student/my-room"
          className="text-blue-600 font-medium"
        >
          ← Back to My Room
        </Link>

        <h1 className="text-3xl font-bold mt-4">
          Roommate Profile
        </h1>

        <p className="text-gray-500">
          View roommate information, compatibility and feedback.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex justify-between items-start">
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-4xl">
                  {roommate.fullName?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-3xl font-bold">
                    {roommate.fullName}
                  </h2>

                  <p className="text-gray-500">
                    {roommate.email}
                  </p>

                  <div className="flex gap-3 mt-4 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {roommate.course || "-"}
                    </span>

                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {roommate.gender || "-"}
                    </span>

                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {roommate.faculty || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-500 mb-1">
                  Compatibility
                </p>

                <h3 className="text-4xl font-bold text-purple-600">
                  {roommate.compatibility || 80}%
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-bold mb-6">
              Lifestyle Profile
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-2xl p-5">
                <p className="text-gray-500 mb-1">
                  Sleep Type
                </p>

                <h3 className="font-bold">
                  {roommate.sleepType || "-"}
                </h3>
              </div>

              <div className="border rounded-2xl p-5">
                <p className="text-gray-500 mb-1">
                  Cleanliness
                </p>

                <h3 className="font-bold">
                  {roommate.cleanlinessLevel || "-"}
                </h3>
              </div>

              <div className="border rounded-2xl p-5">
                <p className="text-gray-500 mb-1">
                  Noise Tolerance
                </p>

                <h3 className="font-bold">
                  {roommate.noiseTolerance || "-"}
                </h3>
              </div>

              <div className="border rounded-2xl p-5 col-span-2">
                <p className="text-gray-500 mb-1">
                  Hobbies
                </p>

                <h3 className="font-bold">
                  {roommate.hobbies || "-"}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Reviews
              </h2>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Leave Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="border rounded-2xl p-6 text-gray-500">
                No reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-2xl p-5"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold">
                        {review.reviewerName}
                      </h3>

                      <span className="text-blue-600 font-bold">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="text-gray-600 mb-2">
                      {review.comment}
                    </p>

                    <p className="text-xs text-gray-400">
                      {review.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-950 text-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-3">
              Roommate Actions
            </h2>

            <p className="text-gray-300 text-sm mb-5">
              Start a chat or leave feedback about
              shared room experience.
            </p>

            <div className="space-y-3">
              <Link
                to="/student/chats"
                className="block text-center bg-white text-gray-950 py-3 rounded-xl font-semibold"
              >
                Start Chat
              </Link>

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold"
              >
                Leave Review
              </button>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Review Policy
            </h2>

            <p className="text-gray-600 text-sm">
              Reviews should be respectful and focused
              on shared living experience.
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">
              Leave Review
            </h2>

            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Bad</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                rows={5}
                placeholder="Write your roommate review..."
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-5 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}