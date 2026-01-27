package com.studentManagement.login.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

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
     * Get Student Profile
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
}