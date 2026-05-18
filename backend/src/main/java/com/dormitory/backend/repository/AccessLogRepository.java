package com.dormitory.backend.repository;

import com.dormitory.backend.entity.AccessLog;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccessLogRepository extends JpaRepository<AccessLog, UUID> {

    Optional<AccessLog> findTopByStudentOrderByScannedAtDesc(User student);

    List<AccessLog> findByStudentOrderByScannedAtDesc(User student);
}