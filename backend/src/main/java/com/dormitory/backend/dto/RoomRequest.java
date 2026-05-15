package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Gender;
import com.dormitory.backend.entity.RoomStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequest {

    private String roomNumber;
    private Integer capacity;
    private Integer occupiedCount;
    private Gender gender;
    private RoomStatus status;
}
