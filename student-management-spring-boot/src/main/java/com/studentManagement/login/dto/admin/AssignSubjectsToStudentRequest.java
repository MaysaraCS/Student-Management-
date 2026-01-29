package com.studentManagement.login.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO for assigning subjects to a student
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignSubjectsToStudentRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Subject IDs are required")
    private List<Long> subjectIds; // Can assign up to 5 subjects
}