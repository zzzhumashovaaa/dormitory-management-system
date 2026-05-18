import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/me");
      setProfile(response.data);
    } catch (error) {
      console.log("PROFILE ERROR:", error);
    }
  };

  const updateProfile = async () => {
    try {
      await api.put("/users/me", profile);
      alert("Profile updated");
      fetchProfile();
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-500">
            Manage your personal information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-5">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-500">
                  Full Name
                </label>

                <input
                  type="text"
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.fullName || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Email
                </label>

                <input
                  type="text"
                  disabled
                  className="w-full border rounded-xl p-3 mt-1 bg-gray-100"
                  value={profile.email || ""}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Student ID
                </label>

                <input
                  type="text"
                  disabled
                  className="w-full border rounded-xl p-3 mt-1 bg-gray-100"
                  value={profile.studentId || ""}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Gender
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.gender || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="">Select gender</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Faculty
                </label>

                <input
                  type="text"
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.faculty || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      faculty: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Course
                </label>

                <input
                  type="text"
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.course || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      course: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-5">
              Lifestyle
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-500">
                  Sleep Type
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.sleepType || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      sleepType: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="EARLY">Early Sleeper</option>
                  <option value="LATE">Night Owl</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Cleanliness Level
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.cleanlinessLevel || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      cleanlinessLevel: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Noise Tolerance
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={profile.noiseTolerance || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      noiseTolerance: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="LOW">Quiet Only</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">No Problem</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Hobbies
                </label>

                <input
                  type="text"
                  className="w-full border rounded-xl p-3 mt-1"
                  placeholder="Music, Reading, Sports..."
                  value={profile.hobbies || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      hobbies: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-5">
              Room Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-500">
                  Room Number
                </label>

                <input
                  type="text"
                  disabled
                  className="w-full border rounded-xl p-3 mt-1 bg-gray-100"
                  value={profile.room?.roomNumber || "Not Assigned"}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Room Type
                </label>

                <input
                  type="text"
                  disabled
                  className="w-full border rounded-xl p-3 mt-1 bg-gray-100"
                  value={profile.room?.roomType || "-"}
                />
              </div>
            </div>
          </div>

          <button
            onClick={updateProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}