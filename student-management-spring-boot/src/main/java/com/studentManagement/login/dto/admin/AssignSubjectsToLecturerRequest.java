package com.studentManagement.login.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO for assigning subjects to a lecturer
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignSubjectsToLecturerRequest {

    @NotNull(message = "Lecturer ID is required")
    private Long lecturerId;

    @NotNull(message = "Subject IDs are required")
    private List<Long> subjectIds; // Can assign up to 3 subjects
}
