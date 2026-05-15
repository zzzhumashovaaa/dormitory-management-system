import DashboardLayout from "../layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Students</h2>
          <p className="text-3xl font-bold">120</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Rooms</h2>
          <p className="text-3xl font-bold">45</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Applications</h2>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>
    </DashboardLayout>
  );
}