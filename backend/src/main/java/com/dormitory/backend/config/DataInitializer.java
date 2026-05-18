package com.dormitory.backend.config;

import com.dormitory.backend.entity.Gender;
import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.RoomStatus;
import com.dormitory.backend.entity.User;
import com.dormitory.backend.repository.RoomRepository;
import com.dormitory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createAdmin();
        createManager();
        createDemoRooms();
        createDemoStudents();

        System.out.println("DEMO DATA READY");
    }

    private void createAdmin() {
        String email = "admin@dormitory.kz";

        User admin = userRepository.findByEmail(email).orElse(new User());

        admin.setFullName("System Admin");
        admin.setEmail(email);

        if (admin.getPassword() == null) {
            admin.setPassword(passwordEncoder.encode("admin123"));
        }

        admin.setRole(Role.ADMIN);

        userRepository.save(admin);

        System.out.println("ADMIN READY: " + email + " | password: admin123");
    }

    private void createManager() {
        String email = "manager@dormitory.kz";

        User manager = userRepository.findByEmail(email).orElse(new User());

        manager.setFullName("Dormitory Manager");
        manager.setEmail(email);

        if (manager.getPassword() == null) {
            manager.setPassword(passwordEncoder.encode("manager123"));
        }

        manager.setRole(Role.MANAGER);

        userRepository.save(manager);

        System.out.println("MANAGER READY: " + email + " | password: manager123");
    }

    private void createDemoRooms() {
        createRoom("501", 4, Gender.FEMALE);
        createRoom("502", 4, Gender.FEMALE);
        createRoom("503", 4, Gender.FEMALE);
        createRoom("504", 4, Gender.FEMALE);
        createRoom("505", 4, Gender.FEMALE);
        createRoom("506", 4, Gender.FEMALE);
        createRoom("507", 4, Gender.FEMALE);
        createRoom("508", 4, Gender.FEMALE);
        createRoom("509", 4, Gender.FEMALE);
        createRoom("510", 4, Gender.FEMALE);

        createRoom("511", 4, Gender.MALE);
        createRoom("512", 4, Gender.MALE);
        createRoom("513", 4, Gender.MALE);
        createRoom("514", 4, Gender.MALE);
        createRoom("515", 4, Gender.MALE);
        createRoom("516", 4, Gender.MALE);
        createRoom("517", 4, Gender.MALE);
        createRoom("518", 4, Gender.MALE);
        createRoom("519", 4, Gender.MALE);
        createRoom("520", 4, Gender.MALE);
    }

    private void createRoom(String roomNumber, Integer capacity, Gender gender) {
        if (roomRepository.existsByRoomNumber(roomNumber)) {
            return;
        }

        Room room = Room.builder()
                .roomNumber(roomNumber)
                .capacity(capacity)
                .occupiedCount(0)
                .gender(gender)
                .status(RoomStatus.ACTIVE)
                .build();

        roomRepository.save(room);
    }

    private void createDemoStudents() {
        long studentCount = userRepository.findByRole(Role.STUDENT).size();

        if (studentCount >= 50) {
            System.out.println("DEMO STUDENTS ALREADY EXIST: " + studentCount);
            return;
        }

        List<DemoStudent> students = List.of(
                new DemoStudent("Aruzhan Sakenova", "aruzhan.sakenova@student.kz", Gender.FEMALE, "CS", "1", "EARLY", "HIGH", "LOW", "reading, coding, yoga", "501"),
                new DemoStudent("Aizhan Zhumashova", "aizhan.zhumashova@student.kz", Gender.FEMALE, "IT", "2", "LATE", "MEDIUM", "LOW", "design, music, blogging", "501"),
                new DemoStudent("Dana Mukhtar", "dana.mukhtar@student.kz", Gender.FEMALE, "Business", "1", "EARLY", "HIGH", "MEDIUM", "books, tennis, cooking", "502"),
                new DemoStudent("Madina Serik", "madina.serik@student.kz", Gender.FEMALE, "Medicine", "3", "EARLY", "HIGH", "LOW", "biology, volunteering, films", "502"),
                new DemoStudent("Tomiris Alim", "tomiris.alim@student.kz", Gender.FEMALE, "Education", "2", "LATE", "MEDIUM", "MEDIUM", "teaching, art, coffee", "503"),
                new DemoStudent("Kamila Nur", "kamila.nur@student.kz", Gender.FEMALE, "Law", "1", "EARLY", "MEDIUM", "LOW", "debate, podcasts, pilates", "503"),
                new DemoStudent("Anel Kairat", "anel.kairat@student.kz", Gender.FEMALE, "CS", "4", "LATE", "LOW", "HIGH", "gaming, movies, startups", "504"),
                new DemoStudent("Aliya Bek", "aliya.bek@student.kz", Gender.FEMALE, "Finance", "2", "EARLY", "HIGH", "LOW", "finance, running, books", "504"),
                new DemoStudent("Zhansaya Oral", "zhansaya.oral@student.kz", Gender.FEMALE, "Design", "1", "LATE", "MEDIUM", "MEDIUM", "drawing, fashion, photography", "505"),
                new DemoStudent("Moldir Askar", "moldir.askar@student.kz", Gender.FEMALE, "Engineering", "3", "EARLY", "HIGH", "MEDIUM", "math, hiking, chess", "505"),

                new DemoStudent("Alina Tulegen", "alina.tulegen@student.kz", Gender.FEMALE, "IT", "1", "LATE", "MEDIUM", "LOW", "frontend, k-pop, gym", "506"),
                new DemoStudent("Zarina Omar", "zarina.omar@student.kz", Gender.FEMALE, "Medicine", "2", "EARLY", "HIGH", "LOW", "medicine, reading, swimming", "506"),
                new DemoStudent("Aigerim Bolat", "aigerim.bolat@student.kz", Gender.FEMALE, "Law", "3", "EARLY", "MEDIUM", "MEDIUM", "law, debate, piano", "507"),
                new DemoStudent("Ayaulym Rustem", "ayaulym.rustem@student.kz", Gender.FEMALE, "Business", "2", "LATE", "LOW", "HIGH", "marketing, dance, series", "507"),
                new DemoStudent("Meruert Talgat", "meruert.talgat@student.kz", Gender.FEMALE, "Education", "4", "EARLY", "HIGH", "LOW", "languages, teaching, journaling", "508"),
                new DemoStudent("Inkar Murat", "inkar.murat@student.kz", Gender.FEMALE, "CS", "1", "LATE", "MEDIUM", "MEDIUM", "ai, games, drawing", "508"),
                new DemoStudent("Assel Karim", "assel.karim@student.kz", Gender.FEMALE, "Finance", "3", "EARLY", "HIGH", "LOW", "investing, books, fitness", "509"),
                new DemoStudent("Nazym Erbol", "nazym.erbol@student.kz", Gender.FEMALE, "Design", "2", "LATE", "MEDIUM", "HIGH", "makeup, design, music", "509"),
                new DemoStudent("Diana Aman", "diana.aman@student.kz", Gender.FEMALE, "Engineering", "1", "EARLY", "MEDIUM", "LOW", "robotics, chess, cycling", "510"),
                new DemoStudent("Saniya Rakhim", "saniya.rakhim@student.kz", Gender.FEMALE, "Medicine", "4", "EARLY", "HIGH", "MEDIUM", "health, films, cooking", "510"),

                new DemoStudent("Mansur Alpyspay", "mansur.alpyspay@student.kz", Gender.MALE, "IT", "2", "LATE", "MEDIUM", "LOW", "coding, trading, football", "511"),
                new DemoStudent("Dias Nurlan", "dias.nurlan@student.kz", Gender.MALE, "CS", "1", "LATE", "LOW", "HIGH", "gaming, football, youtube", "511"),
                new DemoStudent("Alikhan Sapar", "alikhan.sapar@student.kz", Gender.MALE, "Engineering", "3", "EARLY", "HIGH", "LOW", "robotics, gym, chess", "512"),
                new DemoStudent("Arman Serik", "arman.serik@student.kz", Gender.MALE, "Business", "2", "EARLY", "MEDIUM", "LOW", "business, books, basketball", "512"),
                new DemoStudent("Nursultan Bek", "nursultan.bek@student.kz", Gender.MALE, "Law", "1", "LATE", "MEDIUM", "MEDIUM", "debate, films, football", "513"),
                new DemoStudent("Adil Kairat", "adil.kairat@student.kz", Gender.MALE, "Finance", "4", "EARLY", "HIGH", "LOW", "finance, gym, reading", "513"),
                new DemoStudent("Yerasyl Omar", "yerasyl.omar@student.kz", Gender.MALE, "Medicine", "2", "EARLY", "HIGH", "MEDIUM", "biology, running, music", "514"),
                new DemoStudent("Daniyar Askar", "daniyar.askar@student.kz", Gender.MALE, "CS", "3", "LATE", "LOW", "HIGH", "games, backend, films", "514"),
                new DemoStudent("Timur Alim", "timur.alim@student.kz", Gender.MALE, "Design", "1", "LATE", "MEDIUM", "MEDIUM", "design, photos, music", "515"),
                new DemoStudent("Islam Murat", "islam.murat@student.kz", Gender.MALE, "Engineering", "2", "EARLY", "HIGH", "LOW", "cars, engineering, gym", "515"),

                new DemoStudent("Rauan Toleu", "rauan.toleu@student.kz", Gender.MALE, "IT", "1", "LATE", "MEDIUM", "LOW", "frontend, football, anime", "516"),
                new DemoStudent("Ayan Rustem", "ayan.rustem@student.kz", Gender.MALE, "Business", "3", "EARLY", "MEDIUM", "MEDIUM", "startups, boxing, books", "516"),
                new DemoStudent("Sanzhar Talgat", "sanzhar.talgat@student.kz", Gender.MALE, "Law", "2", "EARLY", "HIGH", "LOW", "law, debate, history", "517"),
                new DemoStudent("Bekzat Oral", "bekzat.oral@student.kz", Gender.MALE, "CS", "4", "LATE", "LOW", "HIGH", "cybersecurity, gaming, music", "517"),
                new DemoStudent("Askhat Karim", "askhat.karim@student.kz", Gender.MALE, "Finance", "2", "EARLY", "HIGH", "LOW", "stocks, gym, podcasts", "518"),
                new DemoStudent("Eldar Erbol", "eldar.erbol@student.kz", Gender.MALE, "Medicine", "1", "EARLY", "MEDIUM", "MEDIUM", "medicine, football, films", "518"),
                new DemoStudent("Nurali Aman", "nurali.aman@student.kz", Gender.MALE, "Engineering", "3", "LATE", "MEDIUM", "HIGH", "cars, games, videos", "519"),
                new DemoStudent("Miras Rakhim", "miras.rakhim@student.kz", Gender.MALE, "Education", "2", "EARLY", "HIGH", "LOW", "teaching, reading, chess", "519"),
                new DemoStudent("Alisher Bolat", "alisher.bolat@student.kz", Gender.MALE, "Design", "1", "LATE", "MEDIUM", "MEDIUM", "ui design, drawing, gym", "520"),
                new DemoStudent("Sultan Mukhtar", "sultan.mukhtar@student.kz", Gender.MALE, "IT", "4", "EARLY", "HIGH", "LOW", "devops, hiking, books", "520"),

                new DemoStudent("Amina Zhan", "amina.zhan@student.kz", Gender.FEMALE, "CS", "1", "EARLY", "HIGH", "LOW", "python, yoga, reading", null),
                new DemoStudent("Karina Seit", "karina.seit@student.kz", Gender.FEMALE, "Business", "2", "LATE", "MEDIUM", "MEDIUM", "marketing, dancing, coffee", null),
                new DemoStudent("Rimma Nauryz", "rimma.nauryz@student.kz", Gender.FEMALE, "Law", "3", "EARLY", "MEDIUM", "LOW", "law, debate, books", null),
                new DemoStudent("Laura Yesen", "laura.yesen@student.kz", Gender.FEMALE, "Medicine", "1", "EARLY", "HIGH", "LOW", "health, chemistry, swimming", null),
                new DemoStudent("Yasmina Ali", "yasmina.ali@student.kz", Gender.FEMALE, "Design", "2", "LATE", "LOW", "HIGH", "fashion, music, photos", null),

                new DemoStudent("Azamat Zhan", "azamat.zhan@student.kz", Gender.MALE, "CS", "1", "LATE", "MEDIUM", "LOW", "java, football, gaming", null),
                new DemoStudent("Kanat Seit", "kanat.seit@student.kz", Gender.MALE, "Business", "2", "EARLY", "HIGH", "LOW", "sales, gym, books", null),
                new DemoStudent("Ramazan Nauryz", "ramazan.nauryz@student.kz", Gender.MALE, "Law", "3", "EARLY", "MEDIUM", "MEDIUM", "politics, debate, football", null),
                new DemoStudent("Temirlan Yesen", "temirlan.yesen@student.kz", Gender.MALE, "Medicine", "1", "EARLY", "HIGH", "LOW", "biology, running, chess", null),
                new DemoStudent("Ilyas Ali", "ilyas.ali@student.kz", Gender.MALE, "Engineering", "2", "LATE", "LOW", "HIGH", "cars, games, music", null),

                new DemoStudent("Akniet Sapar", "akniet.sapar@student.kz", Gender.FEMALE, "Education", "1", "EARLY", "HIGH", "LOW", "languages, books, volunteering", null),
                new DemoStudent("Gulnaz Toleu", "gulnaz.toleu@student.kz", Gender.FEMALE, "Finance", "4", "EARLY", "MEDIUM", "LOW", "finance, gym, podcasts", null),
                new DemoStudent("Nazerke Akim", "nazerke.akim@student.kz", Gender.FEMALE, "IT", "3", "LATE", "MEDIUM", "MEDIUM", "web, design, series", null),
                new DemoStudent("Batyr Akim", "batyr.akim@student.kz", Gender.MALE, "IT", "3", "LATE", "MEDIUM", "MEDIUM", "web, games, football", null),
                new DemoStudent("Olzhas Amanzhol", "olzhas.amanzhol@student.kz", Gender.MALE, "Finance", "4", "EARLY", "HIGH", "LOW", "investing, running, books", null)
        );

        int index = 1;

        for (DemoStudent item : students) {
            if (userRepository.existsByEmail(item.email())) {
                continue;
            }

            User student = new User();
            student.setFullName(item.fullName());
            student.setEmail(item.email());
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole(Role.STUDENT);
            student.setGender(item.gender());
            student.setStudentId("STU-" + String.format("%04d", index));
            student.setFaculty(item.faculty());
            student.setCourse(item.course());
            student.setSleepType(item.sleepType());
            student.setCleanlinessLevel(item.cleanlinessLevel());
            student.setNoiseTolerance(item.noiseTolerance());
            student.setHobbies(item.hobbies());

            if (item.roomNumber() != null) {
                Room room = roomRepository.findByRoomNumber(item.roomNumber()).orElse(null);

                if (room != null && room.getOccupiedCount() < room.getCapacity()) {
                    student.setRoom(room);
                    room.setOccupiedCount(room.getOccupiedCount() + 1);

                    if (room.getOccupiedCount() >= room.getCapacity()) {
                        room.setStatus(RoomStatus.FULL);
                    }

                    roomRepository.save(room);
                }
            }

            userRepository.save(student);
            index++;
        }

        System.out.println("DEMO STUDENTS CREATED. Password for all demo students: student123");
    }

    private record DemoStudent(
            String fullName,
            String email,
            Gender gender,
            String faculty,
            String course,
            String sleepType,
            String cleanlinessLevel,
            String noiseTolerance,
            String hobbies,
            String roomNumber
    ) {
    }
}