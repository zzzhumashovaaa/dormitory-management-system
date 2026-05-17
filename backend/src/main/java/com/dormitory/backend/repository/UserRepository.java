package com.dormitory.backend.repository;

import com.dormitory.backend.entity.Role;
import com.dormitory.backend.entity.Room;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoomAndRole(Room room, Role role);
}