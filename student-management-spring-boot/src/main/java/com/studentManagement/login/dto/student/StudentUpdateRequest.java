package com.studentManagement.login.dto.student;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating student details
 */
@Getter
@Setter
public class StudentUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Student ID is required")
    private String studentID;

    @NotBlank(message = "Mobile number is required")
    private String mobileno;

    @NotBlank(message = "Faculty is required")
    private String faculty;
}