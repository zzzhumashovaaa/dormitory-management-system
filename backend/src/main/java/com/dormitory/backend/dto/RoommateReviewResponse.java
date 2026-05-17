package com.dormitory.backend.dto;

import com.dormitory.backend.entity.RoommateReview;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RoommateReviewResponse {

    private UUID id;
    private String reviewerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public static RoommateReviewResponse from(RoommateReview review) {
        RoommateReviewResponse response = new RoommateReviewResponse();

        response.setId(review.getId());
        response.setReviewerName(review.getReviewer().getFullName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        return response;
    }
}