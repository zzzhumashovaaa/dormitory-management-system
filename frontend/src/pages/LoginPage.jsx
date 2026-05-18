import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);

      const normalizedRole = response.data.role
        ?.replace("ROLE_", "")
        .toUpperCase();

      if (normalizedRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (normalizedRole === "MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      alert(
        "Login failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[420px] p-10 rounded-3xl shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2">
          Dormitory System
        </h1>

        <p className="text-gray-500 mb-8">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-4 rounded-2xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-4 rounded-2xl mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-4 rounded-2xl hover:opacity-90">
          Login
        </button>

        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-black font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}