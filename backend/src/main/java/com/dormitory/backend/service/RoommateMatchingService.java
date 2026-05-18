package com.dormitory.backend.service;

import com.dormitory.backend.dto.RoommateSuggestionResponse;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.RoomStatus;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.RoomRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoommateMatchingService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public List<RoommateSuggestionResponse> getSuggestions(User student) {
        if (student.getGender() == null) {
            throw new RuntimeException("Please complete your profile: gender is required");
        }

        List<Room> rooms = roomRepository.findByGenderAndStatus(
                student.getGender(),
                RoomStatus.ACTIVE
        );

        return rooms.stream()
                .filter(room -> student.getRoom() == null || !room.getId().equals(student.getRoom().getId()))
                .filter(room -> getRealOccupiedCount(room) < room.getCapacity())
                .map(room -> buildSuggestion(student, room))
                .sorted(Comparator.comparing(RoommateSuggestionResponse::getCompatibilityScore).reversed())
                .limit(6)
                .toList();
    }

    private RoommateSuggestionResponse buildSuggestion(User student, Room room) {
        List<User> roommates = userRepository.findByRoomAndRole(room, Role.STUDENT)
                .stream()
                .filter(user -> !user.getId().equals(student.getId()))
                .toList();

        if (roommates.isEmpty()) {
            return RoommateSuggestionResponse.builder()
                    .roomId(room.getId())
                    .roomNumber(room.getRoomNumber())
                    .roommateId(null)
                    .roommateName("Empty room")
                    .compatibilityScore(60)
                    .sleepMatch("No roommate yet")
                    .cleanlinessMatch("No roommate yet")
                    .noiseMatch("No roommate yet")
                    .factors("This room is currently empty. Admin can assign you here automatically.")
                    .build();
        }

        User bestRoommate = roommates.stream()
                .max(Comparator.comparing(roommate -> calculateScore(student, roommate)))
                .orElse(roommates.get(0));

        int score = calculateScore(student, bestRoommate);

        return RoommateSuggestionResponse.builder()
                .roomId(room.getId())
                .roomNumber(room.getRoomNumber())
                .roommateId(bestRoommate.getId())
                .roommateName(bestRoommate.getFullName())
                .compatibilityScore(score)
                .sleepMatch(matchText(student.getSleepType(), bestRoommate.getSleepType()))
                .cleanlinessMatch(matchText(student.getCleanlinessLevel(), bestRoommate.getCleanlinessLevel()))
                .noiseMatch(matchText(student.getNoiseTolerance(), bestRoommate.getNoiseTolerance()))
                .factors(buildFactors(bestRoommate))
                .build();
    }

    private int calculateScore(User student, User roommate) {
        int score = 40;

        if (equalsIgnoreCase(student.getSleepType(), roommate.getSleepType())) {
            score += 25;
        }

        if (equalsIgnoreCase(student.getCleanlinessLevel(), roommate.getCleanlinessLevel())) {
            score += 20;
        }

        if (equalsIgnoreCase(student.getNoiseTolerance(), roommate.getNoiseTolerance())) {
            score += 15;
        }

        if (equalsIgnoreCase(student.getFaculty(), roommate.getFaculty())) {
            score += 5;
        }

        return Math.min(score, 100);
    }

    private int getRealOccupiedCount(Room room) {
        return userRepository.findByRoomAndRole(room, Role.STUDENT).size();
    }

    private String matchText(String first, String second) {
        if (first == null || second == null) {
            return "Not enough data";
        }

        if (first.equalsIgnoreCase(second)) {
            return "Good match";
        }

        return "Different preference";
    }

    private String buildFactors(User roommate) {
        return "Sleep: " + value(roommate.getSleepType()) +
                ", Cleanliness: " + value(roommate.getCleanlinessLevel()) +
                ", Noise: " + value(roommate.getNoiseTolerance()) +
                ", Faculty: " + value(roommate.getFaculty());
    }

    private boolean equalsIgnoreCase(String first, String second) {
        return first != null && second != null && first.equalsIgnoreCase(second);
    }

    private String value(String text) {
        return text == null || text.isBlank() ? "-" : text;
    }
}