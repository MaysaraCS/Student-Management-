package com.studentManagement.login.service;

import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.repository.LecturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LecturerService {

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create a new lecturer (Admin function)
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
     */
    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }

    /**
     * Get lecturer by username
     */
    public Lecturer getLecturerByUsername(String username) {
        return lecturerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }
}