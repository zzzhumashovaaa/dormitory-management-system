package com.dormitory.backend.repository;

import com.dormitory.backend.entity.Gender;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByRoomNumber(String roomNumber);

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByGenderAndStatus(Gender gender, RoomStatus status);
}