package com.dormitory.backend.controller;

import com.dormitory.backend.dto.RoommateResponse;
import com.dormitory.backend.dto.UserProfileRequest;
import com.dormitory.backend.dto.UserProfileResponse;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.UserRepository;
import com.dormitory.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userService.getProfile(user);
    }

    @PutMapping("/me")
    public UserProfileResponse updateCurrentUser(
            Authentication authentication,
            @RequestBody UserProfileRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        return userService.updateProfile(user, request);
    }

    @GetMapping("/me/roommates")
    public List<RoommateResponse> getMyRoommates(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userService.getMyRoommates(user);
    }

    @GetMapping("/students")
    public List<User> getStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    @GetMapping("/managers")
    public List<User> getManagers() {
        return userRepository.findByRole(Role.MANAGER);
    }

    @GetMapping("/admins")
    public List<User> getAdmins() {
        return userRepository.findByRole(Role.ADMIN);
    }
}