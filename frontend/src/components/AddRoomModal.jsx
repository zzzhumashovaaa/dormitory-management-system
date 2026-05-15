import { useState } from "react";
import api from "../api/axios";

export default function AddRoomModal({
  isOpen,
  onClose,
  onRoomAdded,
}) {
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [gender, setGender] = useState("MALE");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/rooms", {
        roomNumber,
        capacity,
        gender,
      });

      onRoomAdded();
      onClose();

      setRoomNumber("");
      setCapacity(2);
      setGender("MALE");
    } catch (error) {
      console.log("CREATE ROOM ERROR:", error);
      alert("Failed to create room");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6">
          Add Room
        </h2>

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
              Create
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