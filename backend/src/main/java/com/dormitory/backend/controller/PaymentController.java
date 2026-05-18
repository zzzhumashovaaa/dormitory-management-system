package com.dormitory.backend.controller;

import com.dormitory.backend.entity.Payment;
import com.dormitory.backend.entity.PaymentStatus;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.PaymentRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/my")
    public List<Payment> getMyPayments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return paymentRepository.findByStudent(user);
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable UUID id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @PostMapping("/create/{studentId}")
    public Payment createPayment(
            @PathVariable UUID studentId,
            @RequestBody Payment payment
    ) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        payment.setStudent(student);

        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.UNPAID);
        }

        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}/pay")
    public Payment payPayment(@PathVariable UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDate.now());

        return paymentRepository.save(payment);
    }

    @GetMapping("/overdue")
    public List<Payment> overduePayments() {
        List<Payment> payments = paymentRepository.findAll();

        payments.forEach(payment -> {
            if (
                    payment.getStatus() != PaymentStatus.PAID &&
                            payment.getDueDate() != null &&
                            payment.getDueDate().isBefore(LocalDate.now())
            ) {
                payment.setStatus(PaymentStatus.OVERDUE);
                paymentRepository.save(payment);
            }
        });

        return paymentRepository.findAll();
    }
}