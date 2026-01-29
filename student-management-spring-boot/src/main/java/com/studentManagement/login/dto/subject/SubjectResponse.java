package com.studentManagement.login.dto.subject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for subject response
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {

    private Long id;
    private String subjectName;
    private String subjectCode;
    private int lecturerCount; // Number of lecturers teaching this subject
    private int studentCount;  // Number of students enrolled in this subject

    // Constructor without counts
    public SubjectResponse(Long id, String subjectName, String subjectCode) {
        this.id = id;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.lecturerCount = 0;
        this.studentCount = 0;
    }
}
