package com.dormitory.backend.service;

import com.dormitory.backend.dto.RoommateReviewRequest;
import com.dormitory.backend.dto.RoommateReviewResponse;
import com.dormitory.backend.entity.RoommateReview;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.RoommateReviewRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoommateReviewService {

    private final RoommateReviewRepository roommateReviewRepository;
    private final UserRepository userRepository;

    public RoommateReviewResponse createReview(
            User reviewer,
            UUID roommateId,
            RoommateReviewRequest request
    ) {
        User roommate = userRepository.findById(roommateId)
                .orElseThrow(() -> new RuntimeException("Roommate not found"));

        if (reviewer.getRoom() == null || roommate.getRoom() == null) {
            throw new RuntimeException("Both students must have a room");
        }

        if (!reviewer.getRoom().getId().equals(roommate.getRoom().getId())) {
            throw new RuntimeException("You can review only your roommate");
        }

        if (reviewer.getId().equals(roommate.getId())) {
            throw new RuntimeException("You cannot review yourself");
        }

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        RoommateReview review = new RoommateReview();
        review.setReviewer(reviewer);
        review.setRoommate(roommate);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        RoommateReview savedReview = roommateReviewRepository.save(review);

        return RoommateReviewResponse.from(savedReview);
    }

    public List<RoommateReviewResponse> getReviews(UUID roommateId) {
        User roommate = userRepository.findById(roommateId)
                .orElseThrow(() -> new RuntimeException("Roommate not found"));

        return roommateReviewRepository.findByRoommateOrderByCreatedAtDesc(roommate)
                .stream()
                .map(RoommateReviewResponse::from)
                .collect(Collectors.toList());
    }
}