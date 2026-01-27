package com.studentManagement.login.controller;

import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.service.LecturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private LecturerService lecturerService;

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

    /**
     * Create Lecturer (Admin only)
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
            response.put("lecturerId", lecturer.getId());
            response.put("username", lecturer.getUsername());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create lecturer: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get All Lecturers
     * GET /api/admin/lecturers
     */
    @GetMapping("/lecturers")
    public ResponseEntity<List<Lecturer>> getAllLecturers() {
        List<Lecturer> lecturers = lecturerService.getAllLecturers();
        return new ResponseEntity<>(lecturers, HttpStatus.OK);
    }
}