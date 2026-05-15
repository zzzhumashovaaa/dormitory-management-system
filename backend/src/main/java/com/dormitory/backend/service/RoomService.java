package com.dormitory.backend.service;

import com.dormitory.backend.dto.RoomRequest;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.RoomStatus;
import com.dormitory.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public Room createRoom(RoomRequest request) {

        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new RuntimeException("Room already exists");
        }

        RoomStatus status = request.getStatus();

        if (status == null) {
            status = RoomStatus.ACTIVE;
        }

        Integer occupiedCount = request.getOccupiedCount();

        if (occupiedCount == null) {
            occupiedCount = 0;
        }

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .capacity(request.getCapacity())
                .occupiedCount(occupiedCount)
                .gender(request.getGender())
                .status(status)
                .build();

        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room updateRoom(Long id, RoomRequest request) {

        Room room = getRoomById(id);

        room.setRoomNumber(request.getRoomNumber());
        room.setCapacity(request.getCapacity());
        room.setOccupiedCount(request.getOccupiedCount());
        room.setGender(request.getGender());
        room.setStatus(request.getStatus());

        return roomRepository.save(room);
    }

    public String deleteRoom(Long id) {

        Room room = getRoomById(id);

        roomRepository.delete(room);

        return "Room deleted successfully";
    }
}