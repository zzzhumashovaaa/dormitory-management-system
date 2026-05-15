import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");
      setRooms(response.data);
    } catch (error) {
      console.log("ROOMS ERROR:", error);
      alert("Failed to load rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-gray-500">Manage dormitory rooms</p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Rooms</p>
          <h2 className="text-3xl font-bold">{rooms.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Available</p>
          <h2 className="text-3xl font-bold">
            {rooms.filter((room) => room.status === "AVAILABLE").length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Full</p>
          <h2 className="text-3xl font-bold">
            {rooms.filter((room) => room.status === "FULL").length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Room Number</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Occupied</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
                <td className="p-4 font-semibold">{room.roomNumber}</td>
                <td className="p-4">{room.capacity}</td>
                <td className="p-4">{room.occupied}</td>
                <td className="p-4">{room.gender}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    {room.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rooms.length === 0 && (
          <p className="p-6 text-gray-500 text-center">
            No rooms found
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}