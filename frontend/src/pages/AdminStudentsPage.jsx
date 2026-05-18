import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await api.get("/admin/students");
      setStudents(response.data || []);
    } catch (error) {
      console.log("STUDENTS ERROR:", error);
      alert("Failed to load students");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");
      setRooms(response.data || []);
    } catch (error) {
      console.log("ROOMS ERROR:", error);
    }
  };

  const assignRoom = async (userId, roomId) => {
    if (!roomId) return;

    try {
      await api.put(`/admin/assign-room/${userId}/${roomId}`);
      fetchStudents();
    } catch (error) {
      console.log("ASSIGN ROOM ERROR:", error);
      alert("Failed to assign room");
    }
  };

  const removeRoom = async (userId) => {
    try {
      await api.put(`/admin/remove-room/${userId}`);
      fetchStudents();
    } catch (error) {
      console.log("REMOVE ROOM ERROR:", error);
      alert("Failed to remove room");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchRooms();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();

      const matchesSearch =
        student.fullName?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.studentId?.toLowerCase().includes(query) ||
        student.faculty?.toLowerCase().includes(query);

      const matchesGender =
        !genderFilter || student.gender === genderFilter;

      const matchesCourse =
        !courseFilter || String(student.course || "") === courseFilter;

      const matchesRoom =
        !roomFilter ||
        String(student.room?.roomNumber || "") === roomFilter;

      return (
        matchesSearch &&
        matchesGender &&
        matchesCourse &&
        matchesRoom
      );
    });
  }, [students, search, genderFilter, courseFilter, roomFilter]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-gray-500">
          View, search and manage dormitory students
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-5">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search name, email, student ID..."
            className="border rounded-xl p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl p-3"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <select
            className="border rounded-xl p-3"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">All courses</option>
            <option value="1">1 course</option>
            <option value="2">2 course</option>
            <option value="3">3 course</option>
            <option value="4">4 course</option>
          </select>

          <select
            className="border rounded-xl p-3"
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
          >
            <option value="">All rooms</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.roomNumber}>
                Room {room.roomNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Faculty</th>
              <th className="p-4">Course</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Room</th>
              <th className="p-4">Assign Room</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-4">
                  <p className="font-semibold">
                    {student.fullName || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.email || "-"}
                  </p>
                </td>

                <td className="p-4">
                  {student.studentId || "-"}
                </td>

                <td className="p-4">
                  {student.faculty || "-"}
                </td>

                <td className="p-4">
                  {student.course || "-"}
                </td>

                <td className="p-4">
                  {student.gender || "-"}
                </td>

                <td className="p-4">
                  {student.room?.roomNumber
                    ? `Room ${student.room.roomNumber}`
                    : "Not assigned"}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <select
                      className="border rounded-xl px-3 py-2"
                      defaultValue=""
                      onChange={(e) =>
                        assignRoom(student.id, e.target.value)
                      }
                    >
                      <option value="">Select room</option>

                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          Room {room.roomNumber}
                        </option>
                      ))}
                    </select>

                    {student.room && (
                      <button
                        onClick={() => removeRoom(student.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-xl"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No students found
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}