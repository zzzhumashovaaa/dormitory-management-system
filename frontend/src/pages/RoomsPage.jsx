import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import AddRoomModal from "../components/AddRoomModal";
import EditRoomModal from "../components/EditRoomModal";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");
      setRooms(response.data);
    } catch (error) {
      console.log("ROOMS ERROR:", error);
    }
  };

  const deleteRoom = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this room?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.log("DELETE ROOM ERROR:", error);
      alert("Failed to delete room");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <DashboardLayout>

      <AddRoomModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onRoomAdded={fetchRooms}
      />
      <EditRoomModal
  isOpen={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  onRoomUpdated={fetchRooms}
  room={selectedRoom}
/>

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Rooms
          </h1>

          <p className="text-gray-500">
            Manage dormitory rooms
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          Add Room
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Room</th>
              <th className="p-4">Occupancy</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
  <td className="p-4 font-semibold">
    {room.roomNumber}
  </td>

  <td className="p-4">
    {room.occupiedCount || 0} / {room.capacity}

    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{
          width: `${Math.min(
            ((room.occupiedCount || 0) / room.capacity) * 100,
            100
          )}%`,
        }}
      ></div>
    </div>
  </td>

  <td className="p-4">
    {room.gender}
  </td>

  <td className="p-4">
    <span
      className={`px-3 py-1 rounded-full text-sm ${
        room.status === "ACTIVE"
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {room.status}
    </span>
  </td>

  <td className="p-4 flex gap-2">
    <button
      onClick={() => {
        setSelectedRoom(room);
        setEditModalOpen(true);
      }}
      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
    >
      Edit
    </button>

    <button
      disabled={(room.occupiedCount || 0) > 0}
      onClick={() => deleteRoom(room.id)}
      className={`px-4 py-2 rounded-lg text-white ${
        (room.occupiedCount || 0) > 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      Delete
    </button>
  </td>
</tr>
            ))}
          </tbody>

        </table>
      </div>

    </DashboardLayout>
  );
}