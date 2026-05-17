package com.dormitory.backend.service;

import com.dormitory.backend.dto.RoomRequest;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.RoomStatus;
import com.dormitory.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public Room createRoom(RoomRequest request) {

        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Room already exists"
            );
        }

        RoomStatus status = request.getStatus() == null
                ? RoomStatus.ACTIVE
                : request.getStatus();

        Integer occupiedCount = request.getOccupiedCount() == null
                ? 0
                : request.getOccupiedCount();

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

        if (request.getRoomNumber() != null) {
            room.setRoomNumber(request.getRoomNumber());
        }

        if (request.getCapacity() != null) {
            room.setCapacity(request.getCapacity());
        }

        if (request.getOccupiedCount() != null) {
            room.setOccupiedCount(request.getOccupiedCount());
        }

        if (request.getGender() != null) {
            room.setGender(request.getGender());
        }

        if (request.getStatus() != null) {
            room.setStatus(request.getStatus());
        }

        if (room.getOccupiedCount() != null && room.getCapacity() != null) {
            if (room.getOccupiedCount() >= room.getCapacity()) {
                room.setStatus(RoomStatus.FULL);
            } else if (room.getStatus() == RoomStatus.FULL) {
                room.setStatus(RoomStatus.ACTIVE);
            }
        }

        return roomRepository.save(room);
    }

    public String deleteRoom(Long id) {

        Room room = getRoomById(id);
        roomRepository.delete(room);

        return "Room deleted successfully";
    }
}