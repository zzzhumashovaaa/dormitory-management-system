package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Gender;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileRequest {

    private String fullName;
    private String email;
    private Gender gender;
    private String studentId;
    private String faculty;
    private String course;
    private String sleepType;
    private String cleanlinessLevel;
    private String noiseTolerance;
    private String hobbies;
}