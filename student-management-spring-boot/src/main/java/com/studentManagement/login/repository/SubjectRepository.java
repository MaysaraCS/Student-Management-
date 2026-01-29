package com.studentManagement.login.repository;

import com.studentManagement.login.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * Repository for Subject entity
 * Provides CRUD operations and custom queries for subjects
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    // Find subject by subject code (unique identifier)
    Optional<Subject> findBySubjectCode(String subjectCode);

    // Check if subject exists by code
    boolean existsBySubjectCode(String subjectCode);

    // Find subjects by name (partial match)
    @Query("SELECT s FROM Subject s WHERE LOWER(s.subjectName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Subject> findBySubjectNameContaining(String name);

    // Get all subjects ordered by name
    List<Subject> findAllByOrderBySubjectNameAsc();

    // Find subjects not assigned to any lecturer
    @Query("SELECT s FROM Subject s WHERE s.lecturers IS EMPTY")
    List<Subject> findUnassignedSubjects();
}