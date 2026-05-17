package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Gender;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.RoomStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomProfileResponse {

    private Long id;
    private String roomNumber;
    private Integer capacity;
    private Integer occupiedCount;
    private Gender gender;
    private RoomStatus status;

    public static RoomProfileResponse from(Room room) {
        if (room == null) {
            return null;
        }

        RoomProfileResponse response = new RoomProfileResponse();

        response.setId(room.getId());
        response.setRoomNumber(room.getRoomNumber());
        response.setCapacity(room.getCapacity());
        response.setOccupiedCount(room.getOccupiedCount());
        response.setGender(room.getGender());
        response.setStatus(room.getStatus());

        return response;
    }
}