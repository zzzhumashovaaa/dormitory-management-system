import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Student Dashboard
        </h1>

        <p className="text-gray-500">
          Dormitory student panel
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-3">
            Dormitory Application
          </h2>

          <p className="text-gray-500 mb-6">
            Submit application for dormitory placement
          </p>

          <Link
            to="/student/application"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Create Application
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-3">
            My Applications
          </h2>

          <p className="text-gray-500 mb-6">
            Track your dormitory requests
          </p>

          <Link
            to="/student/my-applications"
            className="bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            View Applications
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}