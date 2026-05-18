package com.dormitory.backend.service;

import com.dormitory.backend.dto.LoginRequest;
import com.dormitory.backend.dto.RegisterRequest;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.UserRepository;
import com.dormitory.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

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

        String studentId = generateStudentId();
        user.setStudentId(studentId);

        userRepository.save(user);

        return "User registered successfully";
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    private String generateStudentId() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return "ST" + number;
    }
}