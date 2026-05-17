package com.dormitory.backend.service;

import com.dormitory.backend.dto.ComplaintRequest;
import com.dormitory.backend.dto.ComplaintStatusRequest;
import com.dormitory.backend.entity.Complaint;
import com.dormitory.backend.entity.ComplaintStatus;
import com.dormitory.backend.entity.NotificationType;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    public Complaint createComplaint(
            ComplaintRequest request,
            User student
    ) {

        Complaint complaint = Complaint.builder()
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .targetStudentName(request.getTargetStudentName())
                .status(ComplaintStatus.OPEN)
                .student(student)
                .room(student.getRoom())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Complaint savedComplaint = complaintRepository.save(complaint);

        notificationService.notifyAdmins(
                "New complaint",
                student.getFullName() + " submitted a new complaint: " + request.getTitle(),
                NotificationType.GENERAL,
                null
        );

        return savedComplaint;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getMyComplaints(User student) {
        return complaintRepository.findByStudent(student);
    }

    public Complaint getComplaintById(Long id) {

        return complaintRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Complaint not found"));
    }

    public Complaint updateComplaintStatus(
            Long id,
            ComplaintStatusRequest request
    ) {

        Complaint complaint = getComplaintById(id);

        complaint.setStatus(request.getStatus());
        complaint.setAdminResponse(request.getAdminResponse());
        complaint.setUpdatedAt(LocalDateTime.now());

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        notificationService.createNotification(
                complaint.getStudent(),
                "Complaint updated",
                "Your complaint status changed to "
                        + request.getStatus(),
                NotificationType.COMPLAINT_UPDATED
        );

        return updatedComplaint;
    }

    public String deleteComplaint(Long id) {

        Complaint complaint = getComplaintById(id);

        complaintRepository.delete(complaint);

        return "Complaint deleted successfully";
    }
}