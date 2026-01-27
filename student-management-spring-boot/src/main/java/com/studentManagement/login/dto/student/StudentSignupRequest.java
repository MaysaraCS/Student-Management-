package com.studentManagement.login.dto.student;


import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class StudentSignupRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 4, message = "Password must be at least 4 characters")
    private String password;

    @NotBlank(message = "Student ID is required")
    private String studentID;

    @NotBlank(message = "Mobile number is required")
    private String mobileno;

    @NotBlank(message = "Faculty is required")
    private String faculty;
}