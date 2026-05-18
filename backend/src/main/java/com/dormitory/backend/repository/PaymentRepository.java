package com.dormitory.backend.repository;

import com.dormitory.backend.entity.Payment;
import com.dormitory.backend.entity.PaymentStatus;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository
        extends JpaRepository<Payment, UUID> {

    List<Payment> findByStudent(User student);

    List<Payment> findByStatus(PaymentStatus status);
}