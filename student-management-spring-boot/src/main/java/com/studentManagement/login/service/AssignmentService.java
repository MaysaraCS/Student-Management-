package com.studentManagement.login.service;

import com.studentManagement.login.dto.admin.AssignSubjectsToLecturerRequest;
import com.studentManagement.login.dto.admin.AssignSubjectsToStudentRequest;
import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.entity.Student;
import com.studentManagement.login.entity.Subject;
import com.studentManagement.login.repository.LecturerRepository;
import com.studentManagement.login.repository.StudentRepository;
import com.studentManagement.login.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Service for managing subject assignments
 * Handles assigning/unassigning subjects to lecturers and students
 */
@Service
public class AssignmentService {

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    /**
     * Assign subjects to a lecturer (max 3 subjects)
     * @param request Contains lecturer ID and list of subject IDs
     * @return Success message
     */
    @Transactional
    public String assignSubjectsToLecturer(AssignSubjectsToLecturerRequest request) {
        // Find lecturer
        Lecturer lecturer = lecturerRepository.findById(request.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + request.getLecturerId()));

        // Validate maximum limit (3 subjects)
        if (request.getSubjectIds().size() > 3) {
            throw new RuntimeException("A lecturer can only be assigned to a maximum of 3 subjects");
        }

        // Clear existing subjects
        lecturer.getSubjects().clear();

        // Assign new subjects
        for (Long subjectId : request.getSubjectIds()) {
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Subject not found with id: " + subjectId));
            lecturer.addSubject(subject);
        }

        // Save changes
        lecturerRepository.save(lecturer);

        return "Successfully assigned " + request.getSubjectIds().size() + " subject(s) to lecturer";
    }

    /**
     * Assign subjects to a student (max 5 subjects)
     * @param request Contains student ID and list of subject IDs
     * @return Success message
     */
    @Transactional
    public String assignSubjectsToStudent(AssignSubjectsToStudentRequest request) {
        // Find student
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.getStudentId()));

        // Validate maximum limit (5 subjects)
        if (request.getSubjectIds().size() > 5) {
            throw new RuntimeException("A student can only be enrolled in a maximum of 5 subjects");
        }

        // Clear existing subjects
        student.getSubjects().clear();

        // Assign new subjects
        for (Long subjectId : request.getSubjectIds()) {
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Subject not found with id: " + subjectId));
            student.addSubject(subject);
        }

        // Save changes
        studentRepository.save(student);

        return "Successfully enrolled student in " + request.getSubjectIds().size() + " subject(s)";
    }

    /**
     * Get subjects assigned to a lecturer
     * @param lecturerId Lecturer ID
     * @return Set of subjects
     */
    public Set<Subject> getLecturerSubjects(Long lecturerId) {
        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + lecturerId));
        return lecturer.getSubjects();
    }

    /**
     * Get students enrolled in subjects taught by a lecturer
     * @param lecturerId Lecturer ID
     * @return List of students
     */
    public List<Student> getStudentsForLecturer(Long lecturerId) {
        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + lecturerId));

        // Get all subjects taught by this lecturer
        Set<Subject> lecturerSubjects = lecturer.getSubjects();

        // Find all students enrolled in these subjects
        return studentRepository.findAll().stream()
                .filter(student -> student.getSubjects().stream()
                        .anyMatch(lecturerSubjects::contains))
                .distinct()
                .toList();
    }

    /**
     * Get subjects assigned to a student
     * @param studentId Student ID
     * @return Set of subjects
     */
    public Set<Subject> getStudentSubjects(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        return student.getSubjects();
    }

    /**
     * Remove a subject from lecturer
     * @param lecturerId Lecturer ID
     * @param subjectId Subject ID
     * @return Success message
     */
    @Transactional
    public String removeSubjectFromLecturer(Long lecturerId, Long subjectId) {
        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        lecturer.removeSubject(subject);
        lecturerRepository.save(lecturer);

        return "Subject removed from lecturer successfully";
    }

    /**
     * Remove a subject from student
     * @param studentId Student ID
     * @param subjectId Subject ID
     * @return Success message
     */
    @Transactional
    public String removeSubjectFromStudent(Long studentId, Long subjectId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        student.removeSubject(subject);
        studentRepository.save(student);

        return "Subject removed from student successfully";
    }
}