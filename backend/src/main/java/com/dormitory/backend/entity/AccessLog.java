package com.dormitory.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "access_logs")
public class AccessLog extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessStatus status;

    @Column(nullable = false)
    private LocalDateTime scannedAt;
}