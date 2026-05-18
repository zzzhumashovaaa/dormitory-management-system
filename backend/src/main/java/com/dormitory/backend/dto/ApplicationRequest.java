package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ApplicationType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ApplicationRequest {

    private ApplicationType type;
    private String message;

    private Long preferredRoomId;
    private String preferredRoomNumber;

    private UUID preferredRoommateId;
    private String preferredRoommateName;

    private Integer compatibilityScore;
    private String matchingFactors;
}