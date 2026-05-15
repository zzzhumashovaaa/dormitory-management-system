import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "STUDENT") {
      return <Navigate to="/student" />;
    }

    return <Navigate to="/dashboard" />;
  }

  return children;
}