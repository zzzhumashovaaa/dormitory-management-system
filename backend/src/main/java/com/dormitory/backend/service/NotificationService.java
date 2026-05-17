package com.dormitory.backend.service;

import com.dormitory.backend.entity.Notification;
import com.dormitory.backend.entity.NotificationType;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.NotificationRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification createNotification(
            User user,
            String title,
            String message,
            NotificationType type
    ) {
        return createNotification(user, title, message, type, null);
    }

    public Notification createNotification(
            User user,
            String title,
            String message,
            NotificationType type,
            Long applicationId
    ) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .applicationId(applicationId)
                .readStatus(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadStatusFalse(user);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setReadStatus(true);

        return notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {
        List<Notification> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user);

        for (Notification notification : notifications) {
            notification.setReadStatus(true);
        }

        notificationRepository.saveAll(notifications);
    }

    public void notifyAdmins(
            String title,
            String message,
            NotificationType type,
            Long applicationId
    ) {
        List<User> admins = userRepository.findByRole(Role.ADMIN);

        for (User admin : admins) {
            createNotification(admin, title, message, type, applicationId);
        }
    }
}