import DashboardLayout from "../layouts/DashboardLayout";

export default function AdminSystemSettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-500">
          Configure main dormitory system parameters
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Authentication</p>
          <h2 className="text-2xl font-bold mt-2">JWT Enabled</h2>
          <p className="text-sm text-gray-400 mt-2">
            Role-based access control is active
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Roles</p>
          <h2 className="text-2xl font-bold mt-2">3 Roles</h2>
          <p className="text-sm text-gray-400 mt-2">
            Student, Manager, Admin
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Database</p>
          <h2 className="text-2xl font-bold mt-2">PostgreSQL</h2>
          <p className="text-sm text-gray-400 mt-2">
            Main system data storage
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">System Modules</h2>

        <div className="space-y-3">
          <div className="flex justify-between border rounded-xl p-4">
            <span>Room Management</span>
            <span className="font-semibold text-green-600">Active</span>
          </div>

          <div className="flex justify-between border rounded-xl p-4">
            <span>Application Processing</span>
            <span className="font-semibold text-green-600">Active</span>
          </div>

          <div className="flex justify-between border rounded-xl p-4">
            <span>Payment Management</span>
            <span className="font-semibold text-green-600">Active</span>
          </div>

          <div className="flex justify-between border rounded-xl p-4">
            <span>Roommate Matching</span>
            <span className="font-semibold text-green-600">Active</span>
          </div>

          <div className="flex justify-between border rounded-xl p-4">
            <span>AI Chat</span>
            <span className="font-semibold text-blue-600">Student Module</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}