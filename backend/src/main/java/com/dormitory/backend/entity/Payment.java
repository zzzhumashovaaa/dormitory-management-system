package com.dormitory.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Double amount;

    private LocalDate dueDate;

    private LocalDate paidAt;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String description;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
}