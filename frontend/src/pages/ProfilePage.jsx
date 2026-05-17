import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    faculty: "",
    course: "",
    studentId: "",
  });

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setForm({
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        gender: response.data.gender || "",
        faculty: response.data.faculty || "",
        course: response.data.course || "",
        studentId: response.data.studentId || "",
      });
    } catch (error) {
      console.log("PROFILE ERROR:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      await api.put("/users/me", form);
      alert("Profile updated successfully");
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);
      alert("Backend update endpoint is not ready yet");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-500">
          Manage your personal information
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow max-w-3xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Student ID</label>
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Faculty</label>
            <input
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Course</label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}