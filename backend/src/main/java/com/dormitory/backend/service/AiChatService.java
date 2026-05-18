package com.dormitory.backend.service;

import com.dormitory.backend.entity.*;
import com.dormitory.backend.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ComplaintRepository complaintRepository;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public String ask(String userMessage) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return "Gemini API key is not configured. Add GEMINI_API_KEY in backend terminal and restart server.";
        }

        User student = getCurrentUser();
        String context = buildStudentContext(student);
        String prompt = buildPrompt(context, userMessage);

        try {
            String requestBody = objectMapper.writeValueAsString(
                    new GeminiRequest(new Content[]{
                            new Content(new Part[]{new Part(prompt)})
                    })
            );

            RestClient restClient = RestClient.create();

            String response = restClient.post()
                    .uri(geminiApiUrl + "?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return extractAnswer(response);

        } catch (Exception e) {
            return "AI chat error: " + e.getMessage();
        }
    }

    private User getCurrentUser() {

        var authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user;
        }

        String email = authentication.getName();

        if (
                email == null ||
                        email.isBlank() ||
                        email.equals("anonymousUser")
        ) {
            throw new RuntimeException("Invalid authenticated user");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found with email: " + email)
                );
    }

    private String buildStudentContext(User student) {
        StringBuilder sb = new StringBuilder();

        sb.append("STUDENT:\n");
        sb.append("Name: ").append(value(student.getFullName())).append("\n");
        sb.append("Email: ").append(value(student.getEmail())).append("\n");
        sb.append("Student ID: ").append(value(student.getStudentId())).append("\n");
        sb.append("Gender: ").append(value(student.getGender())).append("\n");
        sb.append("Faculty: ").append(value(student.getFaculty())).append("\n");
        sb.append("Course: ").append(value(student.getCourse())).append("\n");
        sb.append("Sleep type: ").append(value(student.getSleepType())).append("\n");
        sb.append("Cleanliness: ").append(value(student.getCleanlinessLevel())).append("\n");
        sb.append("Noise tolerance: ").append(value(student.getNoiseTolerance())).append("\n");
        sb.append("Hobbies: ").append(value(student.getHobbies())).append("\n\n");

        Room room = student.getRoom();

        if (room != null) {
            sb.append("ROOM:\n");
            sb.append("Room number: ").append(value(room.getRoomNumber())).append("\n");
            sb.append("Capacity: ").append(value(room.getCapacity())).append("\n");
            sb.append("Occupied: ").append(value(room.getOccupiedCount())).append("\n");
            sb.append("Gender: ").append(value(room.getGender())).append("\n");
            sb.append("Status: ").append(value(room.getStatus())).append("\n\n");

            List<User> roommates = userRepository.findByRoomAndRole(room, Role.STUDENT);

            sb.append("ROOMMATES:\n");
            for (User roommate : roommates) {
                if (!roommate.getId().equals(student.getId())) {
                    sb.append("- ").append(value(roommate.getFullName()))
                            .append(", faculty: ").append(value(roommate.getFaculty()))
                            .append(", course: ").append(value(roommate.getCourse()))
                            .append(", sleep: ").append(value(roommate.getSleepType()))
                            .append(", cleanliness: ").append(value(roommate.getCleanlinessLevel()))
                            .append(", noise: ").append(value(roommate.getNoiseTolerance()))
                            .append(", hobbies: ").append(value(roommate.getHobbies()))
                            .append("\n");
                }
            }
        } else {
            sb.append("ROOM: student has no room yet.\n");
        }

        sb.append("\nAPPLICATIONS:\n");
        for (DormitoryApplication app : applicationRepository.findByStudent(student)) {
            sb.append("- Type: ").append(value(app.getType()))
                    .append(", status: ").append(value(app.getStatus()))
                    .append(", message: ").append(value(app.getMessage()))
                    .append(", preferred room: ").append(value(app.getPreferredRoomNumber()))
                    .append(", preferred roommate: ").append(value(app.getPreferredRoommateName()))
                    .append(", admin comment: ").append(value(app.getAdminComment()))
                    .append("\n");
        }

        sb.append("\nCOMPLAINTS:\n");
        for (Complaint complaint : complaintRepository.findByStudent(student)) {
            sb.append("- Title: ").append(value(complaint.getTitle()))
                    .append(", category: ").append(value(complaint.getCategory()))
                    .append(", description: ").append(value(complaint.getDescription()))
                    .append(", status: ").append(value(complaint.getStatus()))
                    .append(", response: ").append(value(complaint.getAdminResponse()))
                    .append("\n");
        }

        sb.append("\nPAYMENTS:\n");
        for (Payment payment : paymentRepository.findByStudent(student)) {
            sb.append("- Amount: ").append(value(payment.getAmount()))
                    .append(", due date: ").append(value(payment.getDueDate()))
                    .append(", paid at: ").append(value(payment.getPaidAt()))
                    .append(", status: ").append(value(payment.getStatus()))
                    .append(", description: ").append(value(payment.getDescription()))
                    .append("\n");
        }

        return sb.toString();
    }

    private String buildPrompt(String context, String userMessage) {
        return """
                You are an AI assistant inside Dormitory Management System.
                Reply in Russian, friendly and clearly.
                
                Use only the real context below.
                Do not invent missing data.
                
                SYSTEM NAVIGATION:
                - To change room: go to Applications page, click create application, choose transfer/change room, write reason, submit, wait for admin approval.
                - To check application status: go to Applications page.
                - To create complaint: go to Complaints page and create complaint.
                - To check payments: go to Payments page.
                - To see room and roommates: go to My Room page.
                - To chat with manager or roommates: go to Chats page.
                - To check notifications: go to Notifications page.
                - To update hobbies/lifestyle/profile: go to Profile page.
                - To use QR access: go to QR Access page.
                
                If student asks about roommates or activities, analyze room members, hobbies, sleep type, cleanliness and noise tolerance.
                If student asks how to use platform, give exact steps.
                Keep answer short and useful.
                
                CONTEXT:
                %s
                
                QUESTION:
                %s
                """.formatted(context, userMessage);
    }

    private String extractAnswer(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);

        JsonNode textNode = root
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text");

        if (textNode.isMissingNode() || textNode.asText().isBlank()) {
            return "AI returned empty response.";
        }

        return textNode.asText();
    }

    private String value(Object value) {
        return value == null ? "not specified" : value.toString();
    }

    private record GeminiRequest(Content[] contents) {}

    private record Content(Part[] parts) {}

    private record Part(String text) {}
}