package com.dormitory.backend.service;

import com.dormitory.backend.dto.AccessLogResponse;
import com.dormitory.backend.entity.*;
import com.dormitory.backend.repository.AccessLogRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccessService {

    private final AccessLogRepository accessLogRepository;
    private final UserRepository userRepository;

    public AccessLogResponse scan(String studentId) {

        User student = userRepository.findByStudentId(studentId)
                .orElseGet(() -> userRepository.findById(UUID.fromString(studentId))
                        .orElseThrow(() -> new RuntimeException("Student not found")));

        AccessAction nextAction = accessLogRepository
                .findTopByStudentOrderByScannedAtDesc(student)
                .map(lastLog ->
                        lastLog.getAction() == AccessAction.ENTRY
                                ? AccessAction.EXIT
                                : AccessAction.ENTRY
                )
                .orElse(AccessAction.ENTRY);

        LocalDateTime now = LocalDateTime.now();

        AccessStatus status;

        if (nextAction == AccessAction.ENTRY) {
            status = now.toLocalTime().isAfter(LocalTime.of(22, 0))
                    ? AccessStatus.LATE
                    : AccessStatus.ON_TIME;
        } else {
            status = AccessStatus.RECORDED;
        }

        AccessLog log = new AccessLog();
        log.setStudent(student);
        log.setAction(nextAction);
        log.setStatus(status);
        log.setScannedAt(now);

        return AccessLogResponse.from(accessLogRepository.save(log));
    }

    public List<AccessLogResponse> getMyHistory(User user) {
        return accessLogRepository.findByStudentOrderByScannedAtDesc(user)
                .stream()
                .map(AccessLogResponse::from)
                .collect(Collectors.toList());
    }
}