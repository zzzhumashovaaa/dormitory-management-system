package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationStatusRequest {

    private ApplicationStatus status;
}