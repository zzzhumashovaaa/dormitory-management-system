package com.dormitory.backend.repository;

import com.dormitory.backend.entity.ChatMessage;
import com.dormitory.backend.entity.ChatRoom;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom);

    long countByChatRoomAndSenderNotAndCreatedAtAfter(
            ChatRoom chatRoom,
            User sender,
            LocalDateTime createdAt
    );

    long countByChatRoomAndSenderNot(ChatRoom chatRoom, User sender);
}
