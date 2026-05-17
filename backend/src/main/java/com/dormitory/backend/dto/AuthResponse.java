package com.dormitory.backend.dto;

import com.dormitory.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String token;
    private Role role;
    private UUID userId;
}
