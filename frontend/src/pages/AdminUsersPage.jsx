import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "12345678",
    role: "MANAGER",
    gender: "",
    studentId: "",
    faculty: "",
    course: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data || []);
    } catch (error) {
      console.log("USERS ERROR:", error);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.studentId?.toLowerCase().includes(query);

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const createUser = async () => {
    if (!form.fullName || !form.email || !form.password) {
      alert("Please fill full name, email and password");
      return;
    }

    try {
      await api.post("/admin/users", form);

      setForm({
        fullName: "",
        email: "",
        password: "12345678",
        role: "MANAGER",
        gender: "",
        studentId: "",
        faculty: "",
        course: "",
      });

      fetchUsers();
    } catch (error) {
      console.log("CREATE USER ERROR:", error);
      alert("Failed to create user");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch (error) {
      console.log("CHANGE ROLE ERROR:", error);
      alert("Failed to change role");
    }
  };

  const deleteUser = async (id) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.log("DELETE USER ERROR:", error);
      alert("Failed to delete user");
    }
  };

  const totalUsers = users.length;
  const students = users.filter((u) => u.role === "STUDENT").length;
  const managers = users.filter((u) => u.role === "MANAGER").length;
  const admins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users & Roles</h1>
        <p className="text-gray-500">
          Manage system users, managers, admins and access roles
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-4xl font-bold">{totalUsers}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Students</p>
          <h2 className="text-4xl font-bold">{students}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Managers</p>
          <h2 className="text-4xl font-bold">{managers}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">Admins</p>
          <h2 className="text-4xl font-bold">{admins}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <h2 className="text-xl font-bold mb-4">Create User</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            className="border rounded-xl p-3"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="border rounded-xl p-3"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="STUDENT">Student</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            className="border rounded-xl p-3"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="">No gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <input
            className="border rounded-xl p-3"
            placeholder="Student ID"
            value={form.studentId}
            onChange={(e) =>
              setForm({ ...form, studentId: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3"
            placeholder="Faculty"
            value={form.faculty}
            onChange={(e) =>
              setForm({ ...form, faculty: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3"
            placeholder="Course"
            value={form.course}
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
          />
        </div>

        <button
          onClick={createUser}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          Create User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-5">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded-xl p-3"
            placeholder="Search by name, email, student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl p-3"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All roles</option>
            <option value="STUDENT">Students</option>
            <option value="MANAGER">Managers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Student Info</th>
              <th className="p-4">Room</th>
              <th className="p-4">Change Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">
                  <p className="font-semibold">{user.fullName || "-"}</p>
                  <p className="text-sm text-gray-500">{user.email || "-"}</p>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  <p>{user.studentId || "-"}</p>
                  <p className="text-sm text-gray-500">
                    {user.faculty || "-"} {user.course ? `• ${user.course}` : ""}
                  </p>
                </td>

                <td className="p-4">
                  {user.room?.roomNumber ? `Room ${user.room.roomNumber}` : "-"}
                </td>

                <td className="p-4">
                  <select
                    className="border rounded-xl px-3 py-2"
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="p-6 text-center text-gray-500">No users found</p>
        )}
      </div>
    </DashboardLayout>
  );
}