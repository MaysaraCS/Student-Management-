package com.studentManagement.login.repository;

import com.studentManagement.login.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUsername(String username);

    Optional<Student> findByStudentId(String studentId);

    List<Student> findByFaculty(String faculty);

    boolean existsByUsername(String username);

    boolean existsByStudentId(String studentId);
}