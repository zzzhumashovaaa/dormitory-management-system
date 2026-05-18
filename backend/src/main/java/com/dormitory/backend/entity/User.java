package com.dormitory.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String studentId;

    private String faculty;

    private String course;

    private String sleepType;

    private String cleanlinessLevel;

    private String noiseTolerance;
    @Column(length = 1000)
    private String hobbies;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}