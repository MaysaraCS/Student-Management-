package com.studentManagement.login.controller;

import com.studentManagement.login.dto.*;
import com.studentManagement.login.dto.admin.AdminLoginRequest;
import com.studentManagement.login.dto.lecturer.LecturerLoginRequest;
import com.studentManagement.login.dto.lecturer.LecturerUsernamesResponse;
import com.studentManagement.login.dto.student.StudentLoginRequest;
import com.studentManagement.login.dto.student.StudentSignupRequest;
import com.studentManagement.login.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Admin OAuth Login
     * POST /api/auth/admin/login
     */
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody AdminLoginRequest request) {
        try {
            AuthResponse response = authService.adminLogin(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new AuthResponse(null, null, null, "Admin login failed: " + e.getMessage()),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }

    /**
     * Get Lecturer Usernames for Dropdown
     * GET /api/auth/lecturer/usernames
     */
    @GetMapping("/lecturer/usernames")
    public ResponseEntity<LecturerUsernamesResponse> getLecturerUsernames() {
        LecturerUsernamesResponse response = authService.getLecturerUsernames();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Lecturer Login
     * POST /api/auth/lecturer/login
     */
    @PostMapping("/lecturer/login")
    public ResponseEntity<AuthResponse> lecturerLogin(@RequestBody LecturerLoginRequest request) {
        try {
            AuthResponse response = authService.lecturerLogin(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new AuthResponse(null, null, null, "Lecturer login failed: " + e.getMessage()),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }

    /**
     * Student Registration
     * POST /api/auth/student/register
     */
    @PostMapping("/student/register")
    public ResponseEntity<SignupResponse> studentRegister(@Valid @RequestBody StudentSignupRequest request) {
        try {
            SignupResponse response = authService.studentRegister(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            SignupResponse errorResponse = new SignupResponse();
            errorResponse.setResponse("Registration failed: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Student Login
     * POST /api/auth/student/login
     */
    @PostMapping("/student/login")
    public ResponseEntity<AuthResponse> studentLogin(@RequestBody StudentLoginRequest request) {
        try {
            AuthResponse response = authService.studentLogin(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new AuthResponse(null, null, null, "Student login failed: " + e.getMessage()),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }
}