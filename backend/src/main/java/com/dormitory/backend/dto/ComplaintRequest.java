package com.dormitory.backend.dto;

import com.dormitory.backend.entity.ComplaintCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintRequest {

    private ComplaintCategory category;
    private String title;
    private String description;
    private String targetStudentName;
}