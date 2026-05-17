import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}