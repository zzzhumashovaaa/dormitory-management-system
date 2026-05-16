import { useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function CreateApplicationPage() {
  const [type, setType] = useState("ACCOMMODATION");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/applications", {
        type: type,
        message: text,
      });

      alert("Application submitted");

      setText("");
      setType("ACCOMMODATION");
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      alert(
        "Failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6">
          Create Application
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-4 rounded-lg"
          >
            <option value="ACCOMMODATION">Accommodation</option>
            <option value="TRANSFER">Transfer</option>
            <option value="COMPLAINT">Complaint</option>
          </select>

          <textarea
            placeholder="Application text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-4 rounded-lg h-40"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}