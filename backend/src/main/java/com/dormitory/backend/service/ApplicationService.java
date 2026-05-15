package com.dormitory.backend.service;

import com.dormitory.backend.dto.ApplicationRequest;
import com.dormitory.backend.dto.ApplicationStatusRequest;
import com.dormitory.backend.entity.ApplicationStatus;
import com.dormitory.backend.entity.DormitoryApplication;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

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

        return applicationRepository.save(application);
    }

    public String deleteApplication(Long id) {

        DormitoryApplication application = getApplicationById(id);

        applicationRepository.delete(application);

        return "Application deleted successfully";
    }
}