package com.dormitory.backend.controller;

import com.dormitory.backend.dto.RoommateSuggestionResponse;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.service.RoommateMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roommate-matching")
@RequiredArgsConstructor
public class RoommateMatchingController {

    private final RoommateMatchingService roommateMatchingService;

    @GetMapping("/suggestions")
    public List<RoommateSuggestionResponse> getSuggestions(Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        return roommateMatchingService.getSuggestions(student);
    }
}