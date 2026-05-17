package com.dormitory.backend.controller;

import com.dormitory.backend.dto.RoommateReviewRequest;
import com.dormitory.backend.dto.RoommateReviewResponse;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.RoommateReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roommate-reviews")
@RequiredArgsConstructor
public class RoommateReviewController {

    private final RoommateReviewService roommateReviewService;

    @PostMapping("/{roommateId}")
    public RoommateReviewResponse createReview(
            @PathVariable UUID roommateId,
            @RequestBody RoommateReviewRequest request,
            Authentication authentication
    ) {
        User reviewer = (User) authentication.getPrincipal();

        return roommateReviewService.createReview(reviewer, roommateId, request);
    }

    @GetMapping("/{roommateId}")
    public List<RoommateReviewResponse> getReviews(@PathVariable UUID roommateId) {
        return roommateReviewService.getReviews(roommateId);
    }
}