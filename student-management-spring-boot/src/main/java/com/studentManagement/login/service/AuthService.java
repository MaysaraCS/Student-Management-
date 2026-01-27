package com.studentManagement.login.service;

import com.studentManagement.login.config.JWTService;
import com.studentManagement.login.dto.*;
import com.studentManagement.login.dto.admin.AdminLoginRequest;
import com.studentManagement.login.dto.lecturer.LecturerLoginRequest;
import com.studentManagement.login.dto.lecturer.LecturerUsernamesResponse;
import com.studentManagement.login.dto.student.StudentLoginRequest;
import com.studentManagement.login.dto.student.StudentSignupRequest;
import com.studentManagement.login.entity.*;
import com.studentManagement.login.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Admin OAuth Login
     * Only allows the specific email: maysaracs1001@gmail.com
     */
    @Transactional
    public AuthResponse adminLogin(AdminLoginRequest request) {
        // Validate that it's the authorized admin email
        if (!"maysaracs1001@gmail.com".equalsIgnoreCase(request.getEmail())) {
            throw new RuntimeException("Unauthorized admin email");
        }

        // Check if admin exists, if not create
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    Admin newAdmin = new Admin();
                    newAdmin.setName("System Admin");
                    newAdmin.setEmail(request.getEmail());
                    newAdmin.setOauthProvider(request.getOauthProvider());
                    newAdmin.setOauthId(request.getEmail()); // Use email as ID for simplicity
                    newAdmin.setUsername(request.getEmail());
                    newAdmin.setPassword(passwordEncoder.encode("OAUTH_USER")); // Dummy password
                    return adminRepository.save(newAdmin);
                });

        // Generate JWT token
        String token = jwtService.generateToken(admin.getUsername(), Role.ADMIN);

        return new AuthResponse(token, admin.getUsername(), Role.ADMIN);
    }

    /**
     * Lecturer Login
     * Username selected from dropdown, password entered
     */
    public AuthResponse lecturerLogin(LecturerLoginRequest request) {
        // Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new RuntimeException("Invalid credentials");
        }

        // Get lecturer
        Lecturer lecturer = lecturerRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));

        // Verify role
        if (lecturer.getRole() != Role.LECTURER) {
            throw new RuntimeException("User is not a lecturer");
        }

        // Generate token
        String token = jwtService.generateToken(lecturer.getUsername(), Role.LECTURER);

        return new AuthResponse(token, lecturer.getUsername(), Role.LECTURER);
    }

    /**
     * Get all active lecturer usernames for dropdown
     */
    public LecturerUsernamesResponse getLecturerUsernames() {
        List<String> usernames = lecturerRepository.findAllActiveUsernames();
        return new LecturerUsernamesResponse(usernames);
    }

    /**
     * Student Registration
     */
    @Transactional
    public SignupResponse studentRegister(StudentSignupRequest request) {
        // Check if username exists
        if (studentRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if student ID exists
        if (studentRepository.existsByStudentId(request.getStudentID())) {
            throw new RuntimeException("Student ID already exists");
        }

        // Create student
        Student student = new Student(
                request.getName(),
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getStudentID(),
                request.getMobileno(),
                request.getFaculty()
        );

        student = studentRepository.save(student);

        SignupResponse response = new SignupResponse();
        response.setResponse("Student registered successfully with ID: " + student.getId());
        return response;
    }

    /**
     * Student Login
     */
    public AuthResponse studentLogin(StudentLoginRequest request) {
        // Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new RuntimeException("Invalid credentials");
        }

        // Get student
        Student student = studentRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Verify role
        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("User is not a student");
        }

        // Generate token
        String token = jwtService.generateToken(student.getUsername(), Role.STUDENT);

        return new AuthResponse(token, student.getUsername(), Role.STUDENT);
    }
}