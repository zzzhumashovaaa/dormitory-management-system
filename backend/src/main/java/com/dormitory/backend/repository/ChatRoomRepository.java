package com.dormitory.backend.repository;

import com.dormitory.backend.entity.ChatRoom;
import com.dormitory.backend.entity.ChatType;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {

    Optional<ChatRoom> findByRoomAndType(Room room, ChatType type);

    Optional<ChatRoom> findByStudentAndType(User student, ChatType type);

    List<ChatRoom> findByType(ChatType type);
}