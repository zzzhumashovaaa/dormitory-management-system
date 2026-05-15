package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String token;
    private Role role;
}