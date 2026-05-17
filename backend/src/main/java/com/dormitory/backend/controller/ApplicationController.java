package com.dormitory.backend.controller;

import com.dormitory.backend.dto.ApplicationRequest;
import com.dormitory.backend.dto.ApplicationRevisionRequest;
import com.dormitory.backend.dto.ApplicationStatusRequest;
import com.dormitory.backend.dto.ResubmitApplicationRequest;
import com.dormitory.backend.entity.DormitoryApplication;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public DormitoryApplication createApplication(
            @RequestBody ApplicationRequest request,
            Authentication authentication
    ) {
        User student = (User) authentication.getPrincipal();
        return applicationService.createApplication(request, student);
    }

    @GetMapping
    public List<DormitoryApplication> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/my")
    public List<DormitoryApplication> getMyApplications(Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        return applicationService.getMyApplications(student);
    }

    @GetMapping("/{id}")
    public DormitoryApplication getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @PutMapping("/{id}/status")
    public DormitoryApplication updateStatus(
            @PathVariable Long id,
            @RequestBody ApplicationStatusRequest request
    ) {
        return applicationService.updateStatus(id, request);
    }

    @PutMapping("/{id}/request-changes")
    public DormitoryApplication requestChanges(
            @PathVariable Long id,
            @RequestBody ApplicationRevisionRequest request,
            Authentication authentication
    ) {
        System.out.println("REQUEST CHANGES USER: " + authentication.getName());
        System.out.println("REQUEST CHANGES AUTHORITIES: " + authentication.getAuthorities());

        return applicationService.requestChanges(id, request);
    }

    @PutMapping("/{id}/resubmit")
    public DormitoryApplication resubmitApplication(
            @PathVariable Long id,
            @RequestBody ResubmitApplicationRequest request
    ) {
        return applicationService.resubmitApplication(
                id,
                request.getMessage()
        );
    }
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        return applicationService.deleteApplication(id);
    }
}