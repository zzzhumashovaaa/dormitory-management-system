package com.dormitory.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoommateReviewRequest {

    private Integer rating;
    private String comment;
}