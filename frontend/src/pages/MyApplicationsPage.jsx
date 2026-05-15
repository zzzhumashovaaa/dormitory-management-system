import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function MyApplicationsPage() {

  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Applications
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Text</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">

                <td className="p-4">
                  {app.type}
                </td>

                <td className="p-4">
                  {app.text}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                    {app.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}