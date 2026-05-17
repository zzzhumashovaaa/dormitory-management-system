package com.dormitory.backend.service;

import com.dormitory.backend.dto.AuthResponse;
import com.dormitory.backend.dto.RegisterRequest;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.dormitory.backend.dto.LoginRequest;
import com.dormitory.backend.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "User already exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);
        user.setGender(request.getGender());

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                "Login successful",
                token,
                user.getRole(),
                user.getId()
        );
    }
}