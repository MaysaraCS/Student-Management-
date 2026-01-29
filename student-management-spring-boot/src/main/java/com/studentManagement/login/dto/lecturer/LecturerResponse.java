package com.studentManagement.login.dto.lecturer;

import com.studentManagement.login.dto.subject.SubjectResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO for lecturer response with subjects
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LecturerResponse {

    private Long id;
    private String name;
    private String username;
    private String lecturerId;
    private String department;
    private String email;
    private String mobileNo;
    private int subjectCount;
    private List<SubjectResponse> subjects;
}