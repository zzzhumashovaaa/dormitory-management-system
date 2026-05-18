package com.dormitory.backend.controller;

import com.dormitory.backend.dto.AccessLogResponse;
import com.dormitory.backend.dto.QrScanRequest;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.AccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access")
@RequiredArgsConstructor
public class AccessController {

    private final AccessService accessService;

    @PostMapping("/scan")
    public AccessLogResponse scan(@RequestBody QrScanRequest request) {
        return accessService.scan(request.getStudentId());
    }

    @GetMapping("/my-history")
    public List<AccessLogResponse> getMyHistory(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return accessService.getMyHistory(user);
    }
}