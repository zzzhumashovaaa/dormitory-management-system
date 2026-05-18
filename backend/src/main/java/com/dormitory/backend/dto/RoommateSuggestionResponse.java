package com.dormitory.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class RoommateSuggestionResponse {

    private Long roomId;
    private String roomNumber;

    private UUID roommateId;
    private String roommateName;

    private Integer compatibilityScore;

    private String sleepMatch;
    private String cleanlinessMatch;
    private String noiseMatch;

    private String factors;
}