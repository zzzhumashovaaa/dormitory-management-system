package com.dormitory.backend.repository;

import com.dormitory.backend.entity.DormitoryApplication;
import com.dormitory.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<DormitoryApplication, Long> {

    List<DormitoryApplication> findByStudent(User student);
}