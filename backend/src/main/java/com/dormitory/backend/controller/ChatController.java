package com.dormitory.backend.controller;

import com.dormitory.backend.dto.ChatMessageRequest;
import com.dormitory.backend.dto.ChatMessageResponse;
import com.dormitory.backend.dto.ChatRoomResponse;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/my-room")
    public ChatRoomResponse getMyRoomChat(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return chatService.getMyRoomChat(user);
    }

    @GetMapping("/my-manager")
    public ChatRoomResponse getMyManagerChat(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return chatService.getMyManagerChat(user);
    }

    // old URL kept for compatibility
    @GetMapping("/manager")
    public ChatRoomResponse getMyManagerChatOld(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return chatService.getMyManagerChat(user);
    }

    @GetMapping("/manager/all")
    public List<ChatRoomResponse> getManagerChats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return chatService.getManagerChats(user);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return Map.of("count", chatService.getTotalUnreadCount(user));
    }

    @GetMapping("/{chatRoomId}/messages")
    public List<ChatMessageResponse> getMessages(
            @PathVariable UUID chatRoomId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return chatService.getMessages(chatRoomId, user);
    }

    @PostMapping("/{chatRoomId}/read")
    public Map<String, String> markAsRead(
            @PathVariable UUID chatRoomId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        chatService.markAsRead(chatRoomId, user);
        return Map.of("message", "Chat marked as read");
    }

    @PostMapping("/{chatRoomId}/messages")
    public ChatMessageResponse sendMessage(
            @PathVariable UUID chatRoomId,
            @RequestBody ChatMessageRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return chatService.sendMessage(chatRoomId, user, request);
    }
}
