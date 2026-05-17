package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Gender;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UserProfileResponse {

    private UUID id;
    private String fullName;
    private String email;
    private Role role;
    private Gender gender;
    private String studentId;
    private String faculty;
    private String course;
    private String sleepType;
    private String cleanlinessLevel;
    private String noiseTolerance;
    private String hobbies;
    private RoomProfileResponse room;

    public static UserProfileResponse from(User user) {
        UserProfileResponse response = new UserProfileResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setGender(user.getGender());
        response.setStudentId(user.getStudentId());
        response.setFaculty(user.getFaculty());
        response.setCourse(user.getCourse());
        response.setSleepType(user.getSleepType());
        response.setCleanlinessLevel(user.getCleanlinessLevel());
        response.setNoiseTolerance(user.getNoiseTolerance());
        response.setHobbies(user.getHobbies());
        response.setRoom(RoomProfileResponse.from(user.getRoom()));

        return response;
    }
}