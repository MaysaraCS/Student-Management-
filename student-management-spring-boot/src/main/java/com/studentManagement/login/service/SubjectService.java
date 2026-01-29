package com.studentManagement.login.service;

import com.studentManagement.login.dto.subject.SubjectRequest;
import com.studentManagement.login.dto.subject.SubjectResponse;
import com.studentManagement.login.entity.Subject;
import com.studentManagement.login.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing subjects
 * Handles all business logic for CRUD operations on subjects
 */
@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    /**
     * Create a new subject
     * @param request SubjectRequest containing subject details
     * @return Created subject response
     */
    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        // Check if subject code already exists
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new RuntimeException("Subject with code " + request.getSubjectCode() + " already exists");
        }

        // Create new subject entity
        Subject subject = new Subject(
                request.getSubjectName(),
                request.getSubjectCode()
        );

        // Save to database
        Subject savedSubject = subjectRepository.save(subject);

        // Return response DTO
        return convertToResponse(savedSubject);
    }

    /**
     * Get all subjects
     * @return List of all subjects
     */
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAllByOrderBySubjectNameAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get subject by ID
     * @param id Subject ID
     * @return Subject response
     */
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        return convertToResponse(subject);
    }

    /**
     * Get subject by code
     * @param code Subject code
     * @return Subject response
     */
    public SubjectResponse getSubjectByCode(String code) {
        Subject subject = subjectRepository.findBySubjectCode(code)
                .orElseThrow(() -> new RuntimeException("Subject not found with code: " + code));
        return convertToResponse(subject);
    }

    /**
     * Update subject
     * @param id Subject ID
     * @param request Updated subject details
     * @return Updated subject response
     */
    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        // Find existing subject
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));

        // Check if new code conflicts with existing subject
        if (!subject.getSubjectCode().equals(request.getSubjectCode()) &&
                subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new RuntimeException("Subject with code " + request.getSubjectCode() + " already exists");
        }

        // Update fields
        subject.setSubjectName(request.getSubjectName());
        subject.setSubjectCode(request.getSubjectCode());

        // Save updated subject
        Subject updatedSubject = subjectRepository.save(subject);

        return convertToResponse(updatedSubject);
    }

    /**
     * Delete subject by ID
     * @param id Subject ID
     */
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));

        // Check if subject is assigned to any lecturer or student
        if (!subject.getLecturers().isEmpty() || !subject.getStudents().isEmpty()) {
            throw new RuntimeException("Cannot delete subject that is assigned to lecturers or students");
        }

        subjectRepository.delete(subject);
    }

    /**
     * Search subjects by name
     * @param name Subject name (partial match)
     * @return List of matching subjects
     */
    public List<SubjectResponse> searchSubjectsByName(String name) {
        return subjectRepository.findBySubjectNameContaining(name)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to convert Subject entity to SubjectResponse DTO
     */
    private SubjectResponse convertToResponse(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getSubjectName(),
                subject.getSubjectCode(),
                subject.getLecturers().size(),
                subject.getStudents().size()
        );
    }
}