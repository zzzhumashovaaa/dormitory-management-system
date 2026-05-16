package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintStatusRequest {

    private ComplaintStatus status;
    private String adminResponse;
}