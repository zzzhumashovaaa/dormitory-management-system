package com.dormitory.backend.repository;

import com.dormitory.backend.entity.RoommateReview;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoommateReviewRepository extends JpaRepository<RoommateReview, UUID> {

    List<RoommateReview> findByRoommateOrderByCreatedAtDesc(User roommate);
}