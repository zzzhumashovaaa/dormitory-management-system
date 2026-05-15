package com.dormitory.backend.service;

import com.dormitory.backend.dto.ApplicationRequest;
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

    public DormitoryApplication createApplication(ApplicationRequest request, User student) {

        DormitoryApplication application = DormitoryApplication.builder()
                .type(request.getType())
                .message(request.getMessage())
                .status(ApplicationStatus.PENDING)
                .student(student)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

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

    public DormitoryApplication updateStatus(Long id, ApplicationStatusRequest request) {

        DormitoryApplication application = getApplicationById(id);

        application.setStatus(request.getStatus());
        application.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() == ApplicationStatus.APPROVED) {

            User student = application.getStudent();

            if (student.getGender() == null) {
                throw new RuntimeException("Student gender is not specified");
            }

            List<Room> availableRooms = roomRepository.findByGenderAndStatus(
                    student.getGender(),
                    RoomStatus.ACTIVE
            );

            Room selectedRoom = null;

            for (Room room : availableRooms) {

                if (room.getOccupiedCount() < room.getCapacity()) {
                    selectedRoom = room;
                    break;
                }
            }

            if (selectedRoom == null) {
                throw new RuntimeException("No available rooms");
            }

            student.setRoom(selectedRoom);

            selectedRoom.setOccupiedCount(
                    selectedRoom.getOccupiedCount() + 1
            );

            if (selectedRoom.getOccupiedCount()
                    .equals(selectedRoom.getCapacity())) {

                selectedRoom.setStatus(RoomStatus.FULL);
            }

            userRepository.save(student);
            roomRepository.save(selectedRoom);
        }

        return applicationRepository.save(application);
    }

    public String deleteApplication(Long id) {

        DormitoryApplication application = getApplicationById(id);

        applicationRepository.delete(application);

        return "Application deleted successfully";
    }
}