package com.dormitory.backend.controller;

import com.dormitory.backend.entity.*;
import com.dormitory.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.dormitory.backend.dto.AccessLogResponse;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ApplicationRepository applicationRepository;
    private final ComplaintRepository complaintRepository;
    private final PaymentRepository paymentRepository;
    private final AccessLogRepository accessLogRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        long totalUsers = userRepository.count();
        long students = userRepository.findByRole(Role.STUDENT).size();
        long managers = userRepository.findByRole(Role.MANAGER).size();
        long admins = userRepository.findByRole(Role.ADMIN).size();

        long rooms = roomRepository.count();
        long applications = applicationRepository.count();

        long pendingApplications = applicationRepository.findAll()
                .stream()
                .filter(app -> app.getStatus() == ApplicationStatus.PENDING)
                .count();

        long complaints = complaintRepository.count();

        long openComplaints = complaintRepository.findAll()
                .stream()
                .filter(complaint ->
                        complaint.getStatus() == ComplaintStatus.OPEN ||
                                complaint.getStatus() == ComplaintStatus.IN_PROGRESS
                )
                .count();

        long payments = paymentRepository.count();

        long unpaidPayments = paymentRepository.findAll()
                .stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.PAID)
                .count();

        double totalDebt = paymentRepository.findAll()
                .stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.PAID)
                .mapToDouble(payment -> payment.getAmount() == null ? 0 : payment.getAmount())
                .sum();

        long accessLogs = accessLogRepository.count();

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalUsers", totalUsers);
        dashboard.put("students", students);
        dashboard.put("managers", managers);
        dashboard.put("admins", admins);

        dashboard.put("rooms", rooms);
        dashboard.put("applications", applications);
        dashboard.put("pendingApplications", pendingApplications);

        dashboard.put("complaints", complaints);
        dashboard.put("openComplaints", openComplaints);

        dashboard.put("payments", payments);
        dashboard.put("unpaidPayments", unpaidPayments);
        dashboard.put("totalDebt", totalDebt);

        dashboard.put("accessLogs", accessLogs);

        return dashboard;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    @GetMapping("/managers")
    public List<User> getAllManagers() {
        return userRepository.findByRole(Role.MANAGER);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody Map<String, String> request) {
        User user = new User();

        user.setFullName(request.get("fullName"));
        user.setEmail(request.get("email"));
        user.setPassword(passwordEncoder.encode(request.getOrDefault("password", "12345678")));
        user.setRole(Role.valueOf(request.getOrDefault("role", "STUDENT")));

        if (request.get("gender") != null && !request.get("gender").isBlank()) {
            user.setGender(Gender.valueOf(request.get("gender")));
        }

        user.setStudentId(request.get("studentId"));
        user.setFaculty(request.get("faculty"));
        user.setCourse(request.get("course"));

        return userRepository.save(user);
    }

    @PutMapping("/users/{id}/role")
    public User updateUserRole(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.valueOf(request.get("role")));

        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return "User deleted successfully";
    }

    @PutMapping("/assign-room/{userId}/{roomId}")
    public User assignRoom(
            @PathVariable UUID userId,
            @PathVariable Long roomId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (user.getRoom() != null) {
            Room oldRoom = user.getRoom();
            oldRoom.setOccupiedCount(Math.max(0, oldRoom.getOccupiedCount() - 1));

            if (oldRoom.getOccupiedCount() < oldRoom.getCapacity()) {
                oldRoom.setStatus(RoomStatus.ACTIVE);
            }

            roomRepository.save(oldRoom);
        }

        if (room.getOccupiedCount() >= room.getCapacity()) {
            throw new RuntimeException("Room is full");
        }

        user.setRoom(room);
        room.setOccupiedCount(room.getOccupiedCount() + 1);

        if (room.getOccupiedCount() >= room.getCapacity()) {
            room.setStatus(RoomStatus.FULL);
        }

        roomRepository.save(room);

        return userRepository.save(user);
    }

    @PutMapping("/remove-room/{userId}")
    public User removeRoom(@PathVariable UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoom() != null) {
            Room room = user.getRoom();

            room.setOccupiedCount(Math.max(0, room.getOccupiedCount() - 1));
            room.setStatus(RoomStatus.ACTIVE);

            roomRepository.save(room);
            user.setRoom(null);
        }

        return userRepository.save(user);
    }

    @GetMapping("/reports")
    public Map<String, Object> getReports() {
        long totalRooms = roomRepository.count();

        long fullRooms = roomRepository.findAll()
                .stream()
                .filter(room -> room.getStatus() == RoomStatus.FULL)
                .count();

        long availableRooms = roomRepository.findAll()
                .stream()
                .filter(room -> room.getStatus() == RoomStatus.ACTIVE)
                .count();

        double occupancyRate = totalRooms == 0
                ? 0
                : (fullRooms * 100.0) / totalRooms;

        long totalStudents = userRepository.findByRole(Role.STUDENT).size();

        long studentsWithRoom = userRepository.findByRole(Role.STUDENT)
                .stream()
                .filter(student -> student.getRoom() != null)
                .count();

        long studentsWithoutRoom = totalStudents - studentsWithRoom;

        long totalPayments = paymentRepository.count();

        long paidPayments = paymentRepository.findAll()
                .stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PAID)
                .count();

        long unpaidPayments = paymentRepository.findAll()
                .stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.PAID)
                .count();

        double totalDebt = paymentRepository.findAll()
                .stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.PAID)
                .mapToDouble(payment -> payment.getAmount() == null ? 0 : payment.getAmount())
                .sum();

        Map<String, Object> report = new HashMap<>();

        report.put("totalRooms", totalRooms);
        report.put("fullRooms", fullRooms);
        report.put("availableRooms", availableRooms);
        report.put("occupancyRate", occupancyRate);

        report.put("totalStudents", totalStudents);
        report.put("studentsWithRoom", studentsWithRoom);
        report.put("studentsWithoutRoom", studentsWithoutRoom);

        report.put("totalPayments", totalPayments);
        report.put("paidPayments", paidPayments);
        report.put("unpaidPayments", unpaidPayments);
        report.put("totalDebt", totalDebt);

        return report;
    }

    @GetMapping("/audit-logs")
    public List<AccessLogResponse> getAuditLogs() {
        return accessLogRepository.findAllByOrderByScannedAtDesc()
                .stream()
                .map(AccessLogResponse::from)
                .collect(Collectors.toList());
    }
}