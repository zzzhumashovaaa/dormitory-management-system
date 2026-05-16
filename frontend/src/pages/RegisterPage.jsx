import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("MALE");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        gender,
      });

      alert("Registration successful. Please login.");
      window.location.href = "/";
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      alert(
        "Registration failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white w-[420px] p-10 rounded-3xl shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-8">
          Register as a student
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 p-4 rounded-2xl mb-4"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-4 rounded-2xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-4 rounded-2xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full border border-gray-300 p-4 rounded-2xl mb-6"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <button className="w-full bg-black text-white p-4 rounded-2xl hover:opacity-90">
          Register
        </button>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-black font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}