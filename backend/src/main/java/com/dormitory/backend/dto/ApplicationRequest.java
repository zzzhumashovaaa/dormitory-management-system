package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ApplicationType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {

    private ApplicationType type;
    private String message;
}