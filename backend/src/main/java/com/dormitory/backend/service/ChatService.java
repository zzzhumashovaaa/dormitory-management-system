package com.dormitory.backend.service;

import com.dormitory.backend.dto.ChatMessageRequest;
import com.dormitory.backend.dto.ChatMessageResponse;
import com.dormitory.backend.dto.ChatRoomResponse;
import com.dormitory.backend.entity.*;
import com.dormitory.backend.repository.ChatMessageRepository;
import com.dormitory.backend.repository.ChatReadStatusRepository;
import com.dormitory.backend.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatReadStatusRepository chatReadStatusRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatRoomResponse getMyRoomChat(User user) {
        if (user.getRoom() == null) {
            throw new RuntimeException("You do not have assigned room yet");
        }

        ChatRoom chatRoom = chatRoomRepository
                .findByRoomAndType(user.getRoom(), ChatType.ROOM)
                .orElseGet(() -> {
                    ChatRoom newChatRoom = new ChatRoom();
                    newChatRoom.setTitle("Room " + user.getRoom().getRoomNumber() + " Chat");
                    newChatRoom.setType(ChatType.ROOM);
                    newChatRoom.setRoom(user.getRoom());

                    return chatRoomRepository.save(newChatRoom);
                });

        return ChatRoomResponse.from(chatRoom, getUnreadCount(chatRoom, user));
    }

    public ChatRoomResponse getMyManagerChat(User user) {

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException(
                    "Only students can create personal manager chats"
            );
        }

        ChatRoom chatRoom = chatRoomRepository
                .findByStudentAndType(user, ChatType.MANAGER)
                .orElseGet(() -> {

                    ChatRoom newChatRoom = new ChatRoom();

                    newChatRoom.setTitle(
                            user.getFullName() + " - Manager Chat"
                    );

                    newChatRoom.setType(ChatType.MANAGER);

                    newChatRoom.setStudent(user);

                    return chatRoomRepository.save(newChatRoom);
                });

        return ChatRoomResponse.from(chatRoom, getUnreadCount(chatRoom, user));
    }

    public List<ChatRoomResponse> getManagerChats(User user) {
        if (user.getRole() == Role.STUDENT) {
            throw new RuntimeException("Only manager or admin can view manager chats");
        }

        return chatRoomRepository.findByType(ChatType.MANAGER)
                .stream()
                .map(chatRoom -> ChatRoomResponse.from(chatRoom, getUnreadCount(chatRoom, user)))
                .collect(Collectors.toList());
    }

    public List<ChatMessageResponse> getMessages(UUID chatRoomId, User user) {
        ChatRoom chatRoom = getChatRoomOrThrow(chatRoomId);

        validateChatAccess(chatRoom, user);

        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom)
                .stream()
                .map(ChatMessageResponse::from)
                .collect(Collectors.toList());
    }

    public ChatMessageResponse sendMessage(
            UUID chatRoomId,
            User user,
            ChatMessageRequest request
    ) {
        ChatRoom chatRoom = getChatRoomOrThrow(chatRoomId);

        validateChatAccess(chatRoom, user);

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Message cannot be empty");
        }

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setSender(user);
        chatMessage.setMessage(request.getMessage().trim());

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        ChatMessageResponse response = ChatMessageResponse.from(savedMessage);

        markAsRead(chatRoomId, user);

        messagingTemplate.convertAndSend(
                "/topic/chats/" + chatRoomId,
                response
        );

        messagingTemplate.convertAndSend(
                "/topic/chats/unread",
                "updated"
        );

        return response;
    }

    public void markAsRead(UUID chatRoomId, User user) {
        ChatRoom chatRoom = getChatRoomOrThrow(chatRoomId);
        validateChatAccess(chatRoom, user);

        ChatReadStatus readStatus = chatReadStatusRepository
                .findByChatRoomAndUser(chatRoom, user)
                .orElseGet(() -> {
                    ChatReadStatus newStatus = new ChatReadStatus();
                    newStatus.setChatRoom(chatRoom);
                    newStatus.setUser(user);
                    return newStatus;
                });

        readStatus.setLastReadAt(LocalDateTime.now());
        chatReadStatusRepository.save(readStatus);
    }

    public long getTotalUnreadCount(User user) {
        long total = 0;

        if (user.getRole() == Role.STUDENT) {
            if (user.getRoom() != null) {
                total += chatRoomRepository
                        .findByRoomAndType(user.getRoom(), ChatType.ROOM)
                        .map(chatRoom -> getUnreadCount(chatRoom, user))
                        .orElse(0L);
            }

            total += chatRoomRepository
                    .findByStudentAndType(user, ChatType.MANAGER)
                    .map(chatRoom -> getUnreadCount(chatRoom, user))
                    .orElse(0L);
        } else {
            total += chatRoomRepository.findByType(ChatType.MANAGER)
                    .stream()
                    .mapToLong(chatRoom -> getUnreadCount(chatRoom, user))
                    .sum();
        }

        return total;
    }

    private long getUnreadCount(ChatRoom chatRoom, User user) {
        return chatReadStatusRepository
                .findByChatRoomAndUser(chatRoom, user)
                .map(readStatus -> chatMessageRepository.countByChatRoomAndSenderNotAndCreatedAtAfter(
                        chatRoom,
                        user,
                        readStatus.getLastReadAt()
                ))
                .orElseGet(() -> chatMessageRepository.countByChatRoomAndSenderNot(chatRoom, user));
    }

    private ChatRoom getChatRoomOrThrow(UUID chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
    }

    private void validateChatAccess(ChatRoom chatRoom, User user) {

        if (user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER) {
            return;
        }

        if (chatRoom.getType() == ChatType.ROOM) {

            if (user.getRoom() == null) {
                throw new RuntimeException("You do not have assigned room yet");
            }

            if (chatRoom.getRoom() == null ||
                    !chatRoom.getRoom().getId().equals(user.getRoom().getId())) {

                throw new RuntimeException(
                        "You do not have access to this room chat"
                );
            }

            return;
        }

        if (chatRoom.getType() == ChatType.MANAGER) {

            if (chatRoom.getStudent() == null ||
                    !chatRoom.getStudent().getId().equals(user.getId())) {

                throw new RuntimeException(
                        "You do not have access to this manager chat"
                );
            }
        }
    }
}
