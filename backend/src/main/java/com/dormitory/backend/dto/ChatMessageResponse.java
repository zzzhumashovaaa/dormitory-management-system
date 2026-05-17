package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ChatMessage;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ChatMessageResponse {

    private UUID id;
    private UUID senderId;
    private String senderName;
    private String message;
    private LocalDateTime createdAt;

    public static ChatMessageResponse from(ChatMessage chatMessage) {
        ChatMessageResponse response = new ChatMessageResponse();

        response.setId(chatMessage.getId());
        response.setSenderId(chatMessage.getSender().getId());
        response.setSenderName(chatMessage.getSender().getFullName());
        response.setMessage(chatMessage.getMessage());
        response.setCreatedAt(chatMessage.getCreatedAt());

        return response;
    }
}