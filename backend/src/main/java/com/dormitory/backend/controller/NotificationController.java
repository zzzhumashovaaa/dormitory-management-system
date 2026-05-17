package com.dormitory.backend.controller;

import com.dormitory.backend.entity.Notification;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public List<Notification> getMyNotifications() {
        User currentUser = getCurrentUser();
        return notificationService.getMyNotifications(currentUser);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {
        User currentUser = getCurrentUser();

        return Map.of(
                "count",
                notificationService.getUnreadCount(currentUser)
        );
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public String markAllAsRead() {
        User currentUser = getCurrentUser();
        notificationService.markAllAsRead(currentUser);

        return "All notifications marked as read";
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}