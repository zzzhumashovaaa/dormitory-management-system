package com.dormitory.backend.controller;

import com.dormitory.backend.dto.AiChatRequest;
import com.dormitory.backend.dto.AiChatResponse;
import com.dormitory.backend.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-chat")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping
    public AiChatResponse chat(@RequestBody AiChatRequest request) {
        return new AiChatResponse(aiChatService.ask(request.getMessage()));
    }
}