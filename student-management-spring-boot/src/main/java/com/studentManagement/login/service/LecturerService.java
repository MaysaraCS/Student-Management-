package com.studentManagement.login.service;

import com.studentManagement.login.dto.lecturer.LecturerRequest;
import com.studentManagement.login.dto.lecturer.LecturerResponse;
import com.studentManagement.login.dto.subject.SubjectResponse;
import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.entity.Subject;
import com.studentManagement.login.repository.LecturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing lecturers
 * Handles CRUD operations and subject assignments
 */
@Service
public class LecturerService {

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create a new lecturer (Admin function)
     * @return Created lecturer
     */
    @Transactional
    public Lecturer createLecturer(String name, String username, String password,
                                   String lecturerId, String department, String email) {
        // Check if username exists
        if (lecturerRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        // Check if lecturer ID exists
        if (lecturerRepository.existsByLecturerId(lecturerId)) {
            throw new RuntimeException("Lecturer ID already exists");
        }

        // Create lecturer
        Lecturer lecturer = new Lecturer(
                name,
                username,
                passwordEncoder.encode(password),
                lecturerId,
                department,
                email
        );

        return lecturerRepository.save(lecturer);
    }

    /**
     * Get all lecturers
     * @return List of all lecturers
     */
    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }

    /**
     * Get lecturer by ID with subjects
     * @param id Lecturer ID
     * @return Lecturer response with subjects
     */
    public LecturerResponse getLecturerWithSubjects(Long id) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));

        return convertToResponse(lecturer);
    }

    /**
     * Get lecturer by username
     * @param username Username
     * @return Lecturer entity
     */
    public Lecturer getLecturerByUsername(String username) {
        return lecturerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }

    /**
     * Update lecturer details
     * @param id Lecturer ID
     * @param request Updated lecturer details
     * @return Updated lecturer
     */
    @Transactional
    public Lecturer updateLecturer(Long id, LecturerRequest request) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));

        // Update fields
        lecturer.setName(request.getName());
        lecturer.setDepartment(request.getDepartment());
        lecturer.setEmail(request.getEmail());
        lecturer.setMobileNo(request.getMobileNo());

        return lecturerRepository.save(lecturer);
    }

    /**
     * Delete lecturer
     * @param id Lecturer ID
     */
    @Transactional
    public void deleteLecturer(Long id) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));

        // Note: Subject assignments will be automatically removed due to cascade
        lecturerRepository.delete(lecturer);
    }

    /**
     * Get all lecturers with their assigned subjects
     * @return List of lecturer responses with subjects
     */
    public List<LecturerResponse> getAllLecturersWithSubjects() {
        return lecturerRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to convert Lecturer entity to LecturerResponse DTO
     */
    private LecturerResponse convertToResponse(Lecturer lecturer) {
        LecturerResponse response = new LecturerResponse();
        response.setId(lecturer.getId());
        response.setName(lecturer.getName());
        response.setUsername(lecturer.getUsername());
        response.setLecturerId(lecturer.getLecturerId());
        response.setDepartment(lecturer.getDepartment());
        response.setEmail(lecturer.getEmail());
        response.setMobileNo(lecturer.getMobileNo());

        // Convert subjects to DTO
        List<SubjectResponse> subjects = lecturer.getSubjects().stream()
                .map(subject -> new SubjectResponse(
                        subject.getId(),
                        subject.getSubjectName(),
                        subject.getSubjectCode()
                ))
                .collect(Collectors.toList());

        response.setSubjects(subjects);
        response.setSubjectCount(subjects.size());

        return response;
    }
}