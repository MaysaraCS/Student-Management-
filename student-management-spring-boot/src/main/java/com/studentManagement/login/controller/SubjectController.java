package com.studentManagement.login.controller;

import com.studentManagement.login.dto.subject.SubjectRequest;
import com.studentManagement.login.dto.subject.SubjectResponse;
import com.studentManagement.login.service.SubjectService;
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
 * REST Controller for Subject management
 * Admin-only endpoints for managing subjects
 */
@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:4200")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    /**
     * Create a new subject (Admin only)
     * POST /api/subjects
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        SubjectResponse response = subjectService.createSubject(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all subjects (Accessible by Admin, Lecturer, Student)
     * GET /api/subjects
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LECTURER', 'STUDENT')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        List<SubjectResponse> subjects = subjectService.getAllSubjects();
        return new ResponseEntity<>(subjects, HttpStatus.OK);
    }

    /**
     * Get subject by ID
     * GET /api/subjects/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LECTURER', 'STUDENT')")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long id) {
        SubjectResponse subject = subjectService.getSubjectById(id);
        return new ResponseEntity<>(subject, HttpStatus.OK);
    }

    /**
     * Get subject by code
     * GET /api/subjects/code/{code}
     */
    @GetMapping("/code/{code}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LECTURER', 'STUDENT')")
    public ResponseEntity<SubjectResponse> getSubjectByCode(@PathVariable String code) {
        SubjectResponse subject = subjectService.getSubjectByCode(code);
        return new ResponseEntity<>(subject, HttpStatus.OK);
    }

    /**
     * Update subject (Admin only)
     * PUT /api/subjects/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {
        SubjectResponse response = subjectService.updateSubject(id, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Delete subject (Admin only)
     * DELETE /api/subjects/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Subject deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Search subjects by name
     * GET /api/subjects/search?name={name}
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'LECTURER', 'STUDENT')")
    public ResponseEntity<List<SubjectResponse>> searchSubjects(@RequestParam String name) {
        List<SubjectResponse> subjects = subjectService.searchSubjectsByName(name);
        return new ResponseEntity<>(subjects, HttpStatus.OK);
    }
}