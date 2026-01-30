package com.studentManagement.login.service;

import com.studentManagement.login.dto.student.StudentSignupRequest;
import com.studentManagement.login.dto.student.StudentUpdateRequest;
import com.studentManagement.login.entity.Student;
import com.studentManagement.login.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing students (Admin operations)
 */
@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get all students
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Get student by ID
     */
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    /**
     * Create new student (Admin function)
     */
    @Transactional
    public Student createStudent(StudentSignupRequest request) {
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

        return studentRepository.save(student);
    }

    /**
     * Update student
     */
    @Transactional
    public Student updateStudent(Long id, StudentUpdateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        // Check if new username conflicts
        if (!student.getUsername().equals(request.getUsername()) &&
                studentRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if new student ID conflicts
        if (!student.getStudentId().equals(request.getStudentID()) &&
                studentRepository.existsByStudentId(request.getStudentID())) {
            throw new RuntimeException("Student ID already exists");
        }

        // Update fields
        student.setName(request.getName());
        student.setUsername(request.getUsername());
        student.setStudentId(request.getStudentID());
        student.setMobileNo(request.getMobileno());
        student.setFaculty(request.getFaculty());

        return studentRepository.save(student);
    }

    /**
     * Delete student
     */
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        studentRepository.delete(student);
    }
}