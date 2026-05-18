package com.dormitory.backend.service;

import com.dormitory.backend.dto.ApplicationRequest;
import com.dormitory.backend.dto.ApplicationRevisionRequest;
import com.dormitory.backend.dto.ApplicationStatusRequest;
import com.dormitory.backend.entity.*;
import com.dormitory.backend.repository.ApplicationRepository;
import com.dormitory.backend.repository.RoomRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public DormitoryApplication createApplication(ApplicationRequest request, User student) {
        DormitoryApplication application = DormitoryApplication.builder()
                .type(request.getType())
                .message(request.getMessage())
                .status(ApplicationStatus.PENDING)
                .student(student)
                .preferredRoomId(request.getPreferredRoomId())
                .preferredRoomNumber(request.getPreferredRoomNumber())
                .preferredRoommateId(
                        request.getPreferredRoommateId() == null
                                ? null
                                : request.getPreferredRoommateId().toString()
                )
                .preferredRoommateName(request.getPreferredRoommateName())
                .compatibilityScore(request.getCompatibilityScore())
                .matchingFactors(request.getMatchingFactors())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        DormitoryApplication savedApplication = applicationRepository.save(application);

        notificationService.notifyAdmins(
                "New application",
                student.getFullName() + " submitted a dormitory application.",
                NotificationType.GENERAL,
                savedApplication.getId()
        );

        return savedApplication;
    }

    public DormitoryApplication requestChanges(Long id, ApplicationRevisionRequest request) {
        DormitoryApplication application = getApplicationById(id);

        application.setStatus(ApplicationStatus.NEEDS_REVISION);
        application.setAdminComment(request.getAdminComment());
        application.setUpdatedAt(LocalDateTime.now());

        User student = application.getStudent();

        notificationService.createNotification(
                student,
                "Application needs revision",
                "Admin requested changes for your dormitory application.",
                NotificationType.GENERAL,
                application.getId()
        );

        return applicationRepository.save(application);
    }

    public DormitoryApplication resubmitApplication(Long id, String newMessage) {
        DormitoryApplication application = getApplicationById(id);

        application.setMessage(newMessage);
        application.setStatus(ApplicationStatus.PENDING);
        application.setUpdatedAt(LocalDateTime.now());

        User student = application.getStudent();

        notificationService.notifyAdmins(
                "Application resubmitted",
                student.getFullName() + " resubmitted dormitory application.",
                NotificationType.GENERAL,
                application.getId()
        );

        return applicationRepository.save(application);
    }

    public List<DormitoryApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<DormitoryApplication> getMyApplications(User student) {
        return applicationRepository.findByStudent(student);
    }

    public DormitoryApplication getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Transactional
    public DormitoryApplication updateStatus(Long id, ApplicationStatusRequest request) {
        DormitoryApplication application = getApplicationById(id);

        User student = application.getStudent();

        if (request.getStatus() == ApplicationStatus.APPROVED) {
            assignRoomForApprovedApplication(application, student);

            notificationService.createNotification(
                    student,
                    "Application approved",
                    "Your dormitory application has been approved.",
                    NotificationType.APPLICATION_APPROVED
            );
        }

        if (request.getStatus() == ApplicationStatus.REJECTED) {
            notificationService.createNotification(
                    student,
                    "Application rejected",
                    "Your dormitory application has been rejected.",
                    NotificationType.APPLICATION_REJECTED
            );
        }

        application.setStatus(request.getStatus());
        application.setUpdatedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    private void assignRoomForApprovedApplication(DormitoryApplication application, User student) {
        if (student.getGender() == null) {
            throw new RuntimeException("Student gender is required before room assignment");
        }

        Room selectedRoom;

        if (application.getPreferredRoomId() != null) {
            selectedRoom = roomRepository.findById(application.getPreferredRoomId())
                    .orElseThrow(() -> new RuntimeException("Preferred room not found"));

            validatePreferredRoom(selectedRoom, student);
        } else {
            selectedRoom = findAutomaticRoom(student);
        }

        Room oldRoom = student.getRoom();

        if (oldRoom != null && oldRoom.getId().equals(selectedRoom.getId())) {
            return;
        }

        if (oldRoom != null) {
            int oldRealOccupied = getRealOccupiedCount(oldRoom) - 1;
            oldRoom.setOccupiedCount(Math.max(oldRealOccupied, 0));

            if (oldRoom.getOccupiedCount() < oldRoom.getCapacity()) {
                oldRoom.setStatus(RoomStatus.ACTIVE);
            }

            roomRepository.save(oldRoom);
        }

        student.setRoom(selectedRoom);
        userRepository.save(student);

        int newRealOccupied = getRealOccupiedCount(selectedRoom);
        selectedRoom.setOccupiedCount(newRealOccupied);

        if (newRealOccupied >= selectedRoom.getCapacity()) {
            selectedRoom.setStatus(RoomStatus.FULL);
        } else {
            selectedRoom.setStatus(RoomStatus.ACTIVE);
        }

        roomRepository.save(selectedRoom);

        notificationService.createNotification(
                student,
                "Room assigned",
                "You have been assigned to room " + selectedRoom.getRoomNumber(),
                NotificationType.ROOM_ASSIGNED
        );
    }

    private void validatePreferredRoom(Room room, User student) {
        if (room.getGender() != null && !room.getGender().equals(student.getGender())) {
            throw new RuntimeException("Preferred room gender does not match student gender");
        }

        int realOccupied = getRealOccupiedCount(room);

        if (student.getRoom() != null && student.getRoom().getId().equals(room.getId())) {
            return;
        }

        if (realOccupied >= room.getCapacity()) {
            throw new RuntimeException("Preferred room is already full");
        }

        if (room.getStatus() == RoomStatus.FULL) {
            throw new RuntimeException("Preferred room is already full");
        }
    }

    private Room findAutomaticRoom(User student) {
        List<Room> availableRooms = roomRepository.findByGenderAndStatus(
                student.getGender(),
                RoomStatus.ACTIVE
        );

        for (Room room : availableRooms) {
            if (student.getRoom() != null && room.getId().equals(student.getRoom().getId())) {
                continue;
            }

            int realOccupied = getRealOccupiedCount(room);

            if (realOccupied < room.getCapacity()) {
                return room;
            }
        }

        throw new RuntimeException("No available room for this student");
    }

    private int getRealOccupiedCount(Room room) {
        return userRepository.findByRoomAndRole(room, Role.STUDENT).size();
    }

    public String deleteApplication(Long id) {
        DormitoryApplication application = getApplicationById(id);
        applicationRepository.delete(application);

        return "Application deleted successfully";
    }
}