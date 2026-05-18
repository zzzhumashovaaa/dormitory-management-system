package com.dormitory.backend.controller;

import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .toList();
    }
}