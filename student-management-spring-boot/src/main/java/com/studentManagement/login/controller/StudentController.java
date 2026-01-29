package com.studentManagement.login.controller;

import com.studentManagement.login.dto.subject.SubjectResponse;
import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.entity.Student;
import com.studentManagement.login.entity.Subject;
import com.studentManagement.login.repository.StudentRepository;
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
 * REST Controller for Student operations
 * Students can view their subjects and lecturers
 */
@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Student Dashboard
     * GET /api/student/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to Student Dashboard");
        response.put("username", username);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get student profile
     * GET /api/student/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Map<String, String> response = new HashMap<>();
        response.put("username", username);
        response.put("role", "STUDENT");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get subjects assigned to the logged-in student
     * GET /api/student/my-subjects
     */
    @GetMapping("/my-subjects")
    public ResponseEntity<Map<String, Object>> getMySubjects() {
        try {
            // Get logged-in student's username
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Get student by username
            Student student = studentRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Get subjects
            Set<Subject> subjects = assignmentService.getStudentSubjects(student.getId());

            // Create response with subject and lecturer info
            List<Map<String, Object>> subjectDetails = subjects.stream()
                    .map(subject -> {
                        Map<String, Object> detail = new HashMap<>();
                        detail.put("id", subject.getId());
                        detail.put("subjectName", subject.getSubjectName());
                        detail.put("subjectCode", subject.getSubjectCode());

                        // Get lecturers teaching this subject
                        List<Map<String, String>> lecturers = subject.getLecturers().stream()
                                .map(lecturer -> {
                                    Map<String, String> lecturerInfo = new HashMap<>();
                                    lecturerInfo.put("name", lecturer.getName());
                                    lecturerInfo.put("department", lecturer.getDepartment());
                                    lecturerInfo.put("email", lecturer.getEmail());
                                    return lecturerInfo;
                                })
                                .collect(Collectors.toList());

                        detail.put("lecturers", lecturers);

                        return detail;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("studentName", student.getName());
            response.put("studentId", student.getStudentId());
            response.put("faculty", student.getFaculty());
            response.put("subjectCount", subjectDetails.size());
            response.put("subjects", subjectDetails);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get lecturers teaching student's subjects
     * GET /api/student/my-lecturers
     */
    @GetMapping("/my-lecturers")
    public ResponseEntity<Map<String, Object>> getMyLecturers() {
        try {
            // Get logged-in student's username
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Get student by username
            Student student = studentRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Get all lecturers teaching student's subjects
            Set<Lecturer> lecturers = student.getSubjects().stream()
                    .flatMap(subject -> subject.getLecturers().stream())
                    .collect(Collectors.toSet());

            // Convert to DTO
            List<Map<String, Object>> lecturerDetails = lecturers.stream()
                    .map(lecturer -> {
                        Map<String, Object> detail = new HashMap<>();
                        detail.put("name", lecturer.getName());
                        detail.put("lecturerId", lecturer.getLecturerId());
                        detail.put("department", lecturer.getDepartment());
                        detail.put("email", lecturer.getEmail());

                        // Get subjects taught by this lecturer that student is enrolled in
                        List<String> commonSubjects = lecturer.getSubjects().stream()
                                .filter(student.getSubjects()::contains)
                                .map(Subject::getSubjectName)
                                .collect(Collectors.toList());

                        detail.put("subjects", commonSubjects);

                        return detail;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("studentName", student.getName());
            response.put("lecturerCount", lecturerDetails.size());
            response.put("lecturers", lecturerDetails);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}