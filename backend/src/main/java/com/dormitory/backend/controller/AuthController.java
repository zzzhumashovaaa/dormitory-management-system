package com.dormitory.backend.controller;

import com.dormitory.backend.dto.AuthResponse;
import com.dormitory.backend.dto.RegisterRequest;
import com.dormitory.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.dormitory.backend.dto.LoginRequest;
import com.dormitory.backend.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        String message = authService.register(request);

        return new AuthResponse(message, null);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        String token = authService.login(request);

        return new AuthResponse("Login successful", token);
    }
}