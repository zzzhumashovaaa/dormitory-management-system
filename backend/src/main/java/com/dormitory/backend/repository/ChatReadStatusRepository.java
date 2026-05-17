package com.dormitory.backend.repository;

import com.dormitory.backend.entity.ChatReadStatus;
import com.dormitory.backend.entity.ChatRoom;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatReadStatusRepository extends JpaRepository<ChatReadStatus, UUID> {

    Optional<ChatReadStatus> findByChatRoomAndUser(ChatRoom chatRoom, User user);
}
