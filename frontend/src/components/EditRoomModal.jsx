import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EditRoomModal({
  isOpen,
  onClose,
  onRoomUpdated,
  room,
}) {
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [gender, setGender] = useState("MALE");

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber || "");
      setCapacity(room.capacity || 2);
      setGender(room.gender || "MALE");
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/rooms/${room.id}`, {
            roomNumber,
            capacity: Number(capacity),
            occupiedCount: room.occupiedCount ?? 0,
            gender,
            status: room.status ?? "ACTIVE",
            });

      onRoomUpdated();
      onClose();
    } catch (error) {
      console.log("EDIT ROOM ERROR:", error);
      alert("Failed to edit room");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6">Edit Room</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}