package com.studentManagement.login.repository;

import com.studentManagement.login.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {

    Optional<Lecturer> findByUsername(String username);

    Optional<Lecturer> findByLecturerId(String lecturerId);

    List<Lecturer> findByDepartment(String department);

    boolean existsByUsername(String username);

    boolean existsByLecturerId(String lecturerId);

    // Get all active lecturer usernames for dropdown
    @Query("SELECT l.username FROM Lecturer l WHERE l.isActive = true ORDER BY l.username")
    List<String> findAllActiveUsernames();
}