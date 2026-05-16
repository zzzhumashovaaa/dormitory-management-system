import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function CreateComplaintPage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("ROOM_ISSUE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetStudentName, setTargetStudentName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/complaints", {
        category,
        title,
        description,
        targetStudentName,
      });

      alert("Complaint submitted successfully");
      navigate("/student/my-complaints");
    } catch (error) {
      console.log("CREATE COMPLAINT ERROR:", error);
      alert("Failed to submit complaint");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Complaint</h1>
        <p className="text-gray-500">
          Submit a dormitory-related complaint
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            className="border p-4 rounded-xl"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="ROOM_ISSUE">Room Issue</option>
            <option value="NEIGHBOR_COMPLAINT">Neighbor Complaint</option>
            <option value="CLEANLINESS">Cleanliness</option>
            <option value="PAYMENT_ISSUE">Payment Issue</option>
            <option value="SAFETY">Safety</option>
            <option value="OTHER">Other</option>
          </select>

          {category === "NEIGHBOR_COMPLAINT" && (
            <input
              type="text"
              placeholder="Target student name"
              className="border p-4 rounded-xl"
              value={targetStudentName}
              onChange={(e) => setTargetStudentName(e.target.value)}
            />
          )}

          <input
            type="text"
            placeholder="Title"
            className="border p-4 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="border p-4 rounded-xl min-h-[140px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700">
            Submit Complaint
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}