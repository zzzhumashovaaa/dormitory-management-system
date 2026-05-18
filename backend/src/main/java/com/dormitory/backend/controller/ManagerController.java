package com.dormitory.backend.controller;

import com.dormitory.backend.entity.ApplicationStatus;
import com.dormitory.backend.entity.ComplaintStatus;
import com.dormitory.backend.entity.PaymentStatus;
import com.dormitory.backend.repository.ApplicationRepository;
import com.dormitory.backend.repository.ComplaintRepository;
import com.dormitory.backend.repository.PaymentRepository;
import com.dormitory.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ApplicationRepository applicationRepository;
    private final ComplaintRepository complaintRepository;
    private final RoomRepository roomRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {

        long totalApplications = applicationRepository.count();

        long pendingApplications = applicationRepository.findAll()
                .stream()
                .filter(application -> application.getStatus() == ApplicationStatus.PENDING)
                .count();

        long openComplaints = complaintRepository.findAll()
                .stream()
                .filter(complaint -> complaint.getStatus() == ComplaintStatus.OPEN)
                .count();

        long totalRooms = roomRepository.count();

        long unpaidPayments = paymentRepository.findAll()
                .stream()
                .filter(payment ->
                        payment.getStatus() == PaymentStatus.UNPAID ||
                                payment.getStatus() == PaymentStatus.OVERDUE
                )
                .count();

        return Map.of(
                "totalApplications", totalApplications,
                "pendingApplications", pendingApplications,
                "openComplaints", openComplaints,
                "totalRooms", totalRooms,
                "unpaidPayments", unpaidPayments
        );
    }
}