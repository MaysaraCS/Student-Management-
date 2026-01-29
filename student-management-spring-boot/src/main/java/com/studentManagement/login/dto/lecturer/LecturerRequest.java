package com.studentManagement.login.dto.lecturer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating lecturer details
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LecturerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    private String mobileNo;
}