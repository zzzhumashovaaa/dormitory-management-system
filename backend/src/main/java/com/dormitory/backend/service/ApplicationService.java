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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public DormitoryApplication createApplication(
            ApplicationRequest request,
            User student
    ) {
        DormitoryApplication application =
                DormitoryApplication.builder()
                        .type(request.getType())
                        .message(request.getMessage())
                        .status(ApplicationStatus.PENDING)
                        .student(student)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

        DormitoryApplication savedApplication =
                applicationRepository.save(application);

        notificationService.notifyAdmins(
                "New application",
                student.getFullName() + " submitted a dormitory application.",
                NotificationType.GENERAL,
                savedApplication.getId()
        );

        return savedApplication;
    }
    public DormitoryApplication requestChanges(
            Long id,
            ApplicationRevisionRequest request
    ) {
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

    public DormitoryApplication resubmitApplication(
            Long id,
            String newMessage
    ) {
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
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    public DormitoryApplication updateStatus(
            Long id,
            ApplicationStatusRequest request
    ) {
        DormitoryApplication application = getApplicationById(id);

        application.setStatus(request.getStatus());
        application.setUpdatedAt(LocalDateTime.now());

        User student = application.getStudent();

        if (request.getStatus() == ApplicationStatus.APPROVED) {

            if (student.getRoom() == null) {
                List<Room> availableRooms =
                        roomRepository.findByGenderAndStatus(
                                student.getGender(),
                                RoomStatus.ACTIVE
                        );

                Room selectedRoom = null;

                for (Room room : availableRooms) {
                    int occupied =
                            room.getOccupiedCount() == null
                                    ? 0
                                    : room.getOccupiedCount();

                    if (occupied < room.getCapacity()) {
                        selectedRoom = room;
                        break;
                    }
                }

                if (selectedRoom == null) {
                    throw new RuntimeException(
                            "No available room for this student"
                    );
                }

                student.setRoom(selectedRoom);

                int occupied =
                        selectedRoom.getOccupiedCount() == null
                                ? 0
                                : selectedRoom.getOccupiedCount();

                selectedRoom.setOccupiedCount(occupied + 1);

                if (selectedRoom.getOccupiedCount()
                        >= selectedRoom.getCapacity()) {
                    selectedRoom.setStatus(RoomStatus.FULL);
                }

                roomRepository.save(selectedRoom);
                userRepository.save(student);

                notificationService.createNotification(
                        student,
                        "Room assigned",
                        "You have been assigned to room "
                                + selectedRoom.getRoomNumber(),
                        NotificationType.ROOM_ASSIGNED
                );
            }

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

        return applicationRepository.save(application);
    }

    public String deleteApplication(Long id) {
        DormitoryApplication application =
                getApplicationById(id);

        applicationRepository.delete(application);

        return "Application deleted successfully";
    }
}