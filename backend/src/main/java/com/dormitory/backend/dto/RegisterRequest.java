package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Gender;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private Gender gender;
}