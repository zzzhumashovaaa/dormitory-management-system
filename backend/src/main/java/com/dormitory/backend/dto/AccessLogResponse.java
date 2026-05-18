package com.dormitory.backend.dto;

import com.dormitory.backend.entity.AccessLog;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AccessLogResponse {

    private UUID id;
    private String studentName;
    private String studentId;
    private String roomNumber;
    private String action;
    private String status;
    private LocalDateTime scannedAt;

    public static AccessLogResponse from(AccessLog log) {
        return AccessLogResponse.builder()
                .id(log.getId())
                .studentName(log.getStudent().getFullName())
                .studentId(log.getStudent().getStudentId())
                .roomNumber(
                        log.getStudent().getRoom() != null
                                ? log.getStudent().getRoom().getRoomNumber()
                                : null
                )
                .action(log.getAction().name())
                .status(log.getStatus().name())
                .scannedAt(log.getScannedAt())
                .build();
    }
}