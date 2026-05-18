import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const token = localStorage.getItem("token");

  const role =
    localStorage
      .getItem("role")
      ?.replace("ROLE_", "")
      .toUpperCase() || "";

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/login" />;
  }

  return children;
}