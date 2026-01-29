package com.studentManagement.login.controller;

import com.studentManagement.login.dto.admin.AssignSubjectsToLecturerRequest;
import com.studentManagement.login.dto.admin.AssignSubjectsToStudentRequest;
import com.studentManagement.login.dto.lecturer.LecturerRequest;
import com.studentManagement.login.dto.lecturer.LecturerResponse;
import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.service.AssignmentService;
import com.studentManagement.login.service.LecturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Admin operations
 * Manages lecturers, students, and subject assignments
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private LecturerService lecturerService;

    @Autowired
    private AssignmentService assignmentService;

    /**
     * Admin Dashboard
     * GET /api/admin/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getDashboard() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to Admin Dashboard");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ==================== LECTURER MANAGEMENT ====================

    /**
     * Create a new lecturer
     * POST /api/admin/lecturers
     */
    @PostMapping("/lecturers")
    public ResponseEntity<Map<String, Object>> createLecturer(@RequestBody Map<String, String> request) {
        try {
            Lecturer lecturer = lecturerService.createLecturer(
                    request.get("name"),
                    request.get("username"),
                    request.get("password"),
                    request.get("lecturerId"),
                    request.get("department"),
                    request.get("email")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lecturer created successfully");
            response.put("id", lecturer.getId());
            response.put("lecturerId", lecturer.getLecturerId());
            response.put("username", lecturer.getUsername());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create lecturer: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all lecturers
     * GET /api/admin/lecturers
     */
    @GetMapping("/lecturers")
    public ResponseEntity<List<Lecturer>> getAllLecturers() {
        List<Lecturer> lecturers = lecturerService.getAllLecturers();
        return new ResponseEntity<>(lecturers, HttpStatus.OK);
    }

    /**
     * Get all lecturers with their assigned subjects
     * GET /api/admin/lecturers/with-subjects
     */
    @GetMapping("/lecturers/with-subjects")
    public ResponseEntity<List<LecturerResponse>> getAllLecturersWithSubjects() {
        List<LecturerResponse> lecturers = lecturerService.getAllLecturersWithSubjects();
        return new ResponseEntity<>(lecturers, HttpStatus.OK);
    }

    /**
     * Get lecturer by ID with subjects
     * GET /api/admin/lecturers/{id}
     */
    @GetMapping("/lecturers/{id}")
    public ResponseEntity<LecturerResponse> getLecturerById(@PathVariable Long id) {
        LecturerResponse lecturer = lecturerService.getLecturerWithSubjects(id);
        return new ResponseEntity<>(lecturer, HttpStatus.OK);
    }

    /**
     * Update lecturer details
     * PUT /api/admin/lecturers/{id}
     */
    @PutMapping("/lecturers/{id}")
    public ResponseEntity<Map<String, Object>> updateLecturer(
            @PathVariable Long id,
            @Valid @RequestBody LecturerRequest request) {
        try {
            Lecturer lecturer = lecturerService.updateLecturer(id, request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lecturer updated successfully");
            response.put("lecturer", lecturer);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update lecturer: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Delete lecturer
     * DELETE /api/admin/lecturers/{id}
     */
    @DeleteMapping("/lecturers/{id}")
    public ResponseEntity<Map<String, String>> deleteLecturer(@PathVariable Long id) {
        try {
            lecturerService.deleteLecturer(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Lecturer deleted successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete lecturer: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    // ==================== SUBJECT ASSIGNMENT ====================

    /**
     * Assign subjects to a lecturer (max 3)
     * POST /api/admin/assign/lecturer
     */
    @PostMapping("/assign/lecturer")
    public ResponseEntity<Map<String, String>> assignSubjectsToLecturer(
            @Valid @RequestBody AssignSubjectsToLecturerRequest request) {
        try {
            String message = assignmentService.assignSubjectsToLecturer(request);

            Map<String, String> response = new HashMap<>();
            response.put("message", message);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Assign subjects to a student (max 5)
     * POST /api/admin/assign/student
     */
    @PostMapping("/assign/student")
    public ResponseEntity<Map<String, String>> assignSubjectsToStudent(
            @Valid @RequestBody AssignSubjectsToStudentRequest request) {
        try {
            String message = assignmentService.assignSubjectsToStudent(request);

            Map<String, String> response = new HashMap<>();
            response.put("message", message);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Remove subject from lecturer
     * DELETE /api/admin/assign/lecturer/{lecturerId}/subject/{subjectId}
     */
    @DeleteMapping("/assign/lecturer/{lecturerId}/subject/{subjectId}")
    public ResponseEntity<Map<String, String>> removeSubjectFromLecturer(
            @PathVariable Long lecturerId,
            @PathVariable Long subjectId) {
        try {
            String message = assignmentService.removeSubjectFromLecturer(lecturerId, subjectId);

            Map<String, String> response = new HashMap<>();
            response.put("message", message);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Remove subject from student
     * DELETE /api/admin/assign/student/{studentId}/subject/{subjectId}
     */
    @DeleteMapping("/assign/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<Map<String, String>> removeSubjectFromStudent(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        try {
            String message = assignmentService.removeSubjectFromStudent(studentId, subjectId);

            Map<String, String> response = new HashMap<>();
            response.put("message", message);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}