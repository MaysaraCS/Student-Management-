package com.studentManagement.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Student Entity
 * Represents a student who can enroll in up to 5 subjects
 */
@Getter
@Setter
@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
public class Student extends User {

    @Column(name = "student_id", unique = true, nullable = false, length = 50)
    private String studentId;

    @Column(name = "faculty", nullable = false, length = 100)
    private String faculty;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;


    /**
     * Many-to-Many relationship with Subject
     * A student can enroll in up to 5 subjects
     * joinTable creates the student_subjects join table
     */
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "student_subjects",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    // Default constructor
    public Student() {
        super(Role.STUDENT);
    }

    // Constructor with parameters
    public Student(String name, String username, String password, String studentId,
                   String mobileNo, String faculty) {
        super(Role.STUDENT);
        this.setName(name);
        this.setUsername(username);
        this.setPassword(password);
        this.studentId = studentId;
        this.setMobileNo(mobileNo);
        this.faculty = faculty;
        this.enrollmentDate = LocalDate.now();
    }

    /**
     * Helper method to add a subject to student
     * Checks if maximum limit (5 subjects) is reached
     */
    public void addSubject(Subject subject) {
        if (this.subjects.size() >= 5) {
            throw new RuntimeException("Student can only enroll in up to 5 subjects");
        }
        this.subjects.add(subject);
        subject.getStudents().add(this);
    }

    /**
     * Helper method to remove a subject from student
     */
    public void removeSubject(Subject subject) {
        this.subjects.remove(subject);
        subject.getStudents().remove(this);
    }

    /**
     * Get count of enrolled subjects
     */
    public int getSubjectCount() {
        return this.subjects.size();
    }
}