package com.dormitory.backend.controller;

import com.dormitory.backend.dto.ComplaintRequest;
import com.dormitory.backend.dto.ComplaintStatusRequest;
import com.dormitory.backend.entity.Complaint;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public Complaint createComplaint(@RequestBody ComplaintRequest request) {
        User currentUser = getCurrentUser();
        return complaintService.createComplaint(request, currentUser);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @GetMapping("/my")
    public List<Complaint> getMyComplaints() {
        User currentUser = getCurrentUser();
        return complaintService.getMyComplaints(currentUser);
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id);
    }

    @PutMapping("/{id}/status")
    public Complaint updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody ComplaintStatusRequest request
    ) {
        return complaintService.updateComplaintStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteComplaint(@PathVariable Long id) {
        return complaintService.deleteComplaint(id);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}