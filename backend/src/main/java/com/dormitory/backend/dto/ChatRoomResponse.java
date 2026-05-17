package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ChatRoom;
import com.dormitory.backend.entity.ChatType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ChatRoomResponse {

    private UUID id;
    private String title;
    private ChatType type;
    private String roomNumber;
    private UUID studentId;
    private String studentName;
    private long unreadCount;

    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return from(chatRoom, 0);
    }

    public static ChatRoomResponse from(ChatRoom chatRoom, long unreadCount) {
        ChatRoomResponse response = new ChatRoomResponse();

        response.setId(chatRoom.getId());
        response.setTitle(chatRoom.getTitle());
        response.setType(chatRoom.getType());
        response.setUnreadCount(unreadCount);

        if (chatRoom.getRoom() != null) {
            response.setRoomNumber(chatRoom.getRoom().getRoomNumber());
        }

        if (chatRoom.getStudent() != null) {
            response.setStudentId(chatRoom.getStudent().getId());
            response.setStudentName(chatRoom.getStudent().getFullName());
        }

        return response;
    }
}
