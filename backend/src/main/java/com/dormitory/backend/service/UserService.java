package com.dormitory.backend.service;

import com.dormitory.backend.dto.RoommateResponse;
import com.dormitory.backend.dto.UserProfileRequest;
import com.dormitory.backend.dto.UserProfileResponse;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(User user) {
        return UserProfileResponse.from(user);
    }

    public UserProfileResponse updateProfile(User user, UserProfileRequest request) {
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setStudentId(request.getStudentId());
        user.setFaculty(request.getFaculty());
        user.setCourse(request.getCourse());
        user.setSleepType(request.getSleepType());
        user.setCleanlinessLevel(request.getCleanlinessLevel());
        user.setNoiseTolerance(request.getNoiseTolerance());
        user.setHobbies(request.getHobbies());

        User savedUser = userRepository.save(user);

        return UserProfileResponse.from(savedUser);
    }

    public List<RoommateResponse> getMyRoommates(User user) {
        if (user.getRoom() == null) {
            return List.of();
        }

        return userRepository.findByRoomAndRole(user.getRoom(), Role.STUDENT)
                .stream()
                .filter(roommate -> !roommate.getId().equals(user.getId()))
                .map(RoommateResponse::from)
                .collect(Collectors.toList());
    }
}