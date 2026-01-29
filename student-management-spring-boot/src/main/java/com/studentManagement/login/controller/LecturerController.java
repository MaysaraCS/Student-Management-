package com.studentManagement.login.controller;

import com.studentManagement.login.dto.subject.SubjectResponse;
import com.studentManagement.login.entity.Student;
import com.studentManagement.login.entity.Subject;
import com.studentManagement.login.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * REST Controller for Lecturer operations
 * Lecturers can view their subjects and students
 */
@RestController
@RequestMapping("/api/lecturer")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('LECTURER')")
public class LecturerController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private com.studentManagement.login.service.LecturerService lecturerService;

    /**
     * Lecturer Dashboard
     * GET /api/lecturer/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to Lecturer Dashboard");
        response.put("username", username);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get lecturer's profile
     * GET /api/lecturer/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Map<String, String> response = new HashMap<>();
        response.put("username", username);
        response.put("role", "LECTURER");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get subjects assigned to the logged-in lecturer
     * GET /api/lecturer/my-subjects
     */
    @GetMapping("/my-subjects")
    public ResponseEntity<Map<String, Object>> getMySubjects() {
        try {
            // Get logged-in lecturer's username
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Get lecturer by username
            var lecturer = lecturerService.getLecturerByUsername(username);

            // Get subjects
            Set<Subject> subjects = assignmentService.getLecturerSubjects(lecturer.getId());

            // Convert to DTO
            List<SubjectResponse> subjectResponses = subjects.stream()
                    .map(subject -> new SubjectResponse(
                            subject.getId(),
                            subject.getSubjectName(),
                            subject.getSubjectCode(),
                            subject.getLecturers().size(),
                            subject.getStudents().size()
                    ))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("lecturerName", lecturer.getName());
            response.put("department", lecturer.getDepartment());
            response.put("subjectCount", subjectResponses.size());
            response.put("subjects", subjectResponses);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get students enrolled in lecturer's subjects
     * GET /api/lecturer/my-students
     */
    @GetMapping("/my-students")
    public ResponseEntity<Map<String, Object>> getMyStudents() {
        try {
            // Get logged-in lecturer's username
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Get lecturer by username
            var lecturer = lecturerService.getLecturerByUsername(username);

            // Get students
            List<Student> students = assignmentService.getStudentsForLecturer(lecturer.getId());

            // Convert to simple DTO
            List<Map<String, Object>> studentResponses = students.stream()
                    .map(student -> {
                        Map<String, Object> studentData = new HashMap<>();
                        studentData.put("id", student.getId());
                        studentData.put("name", student.getName());
                        studentData.put("studentId", student.getStudentId());
                        studentData.put("faculty", student.getFaculty());
                        studentData.put("username", student.getUsername());

                        // Get common subjects between lecturer and student
                        Set<Subject> lecturerSubjects = lecturer.getSubjects();
                        Set<Subject> studentSubjects = student.getSubjects();

                        List<String> commonSubjects = studentSubjects.stream()
                                .filter(lecturerSubjects::contains)
                                .map(Subject::getSubjectName)
                                .collect(Collectors.toList());

                        studentData.put("enrolledSubjects", commonSubjects);

                        return studentData;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("lecturerName", lecturer.getName());
            response.put("studentCount", studentResponses.size());
            response.put("students", studentResponses);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}