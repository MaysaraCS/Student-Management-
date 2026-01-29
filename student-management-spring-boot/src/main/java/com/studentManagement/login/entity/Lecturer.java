package com.studentManagement.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/**
 * Lecturer Entity
 * Represents a lecturer who can teach up to 3 subjects
 */
@Getter
@Setter
@Entity
@Table(name = "lecturers")
@DiscriminatorValue("LECTURER")
public class Lecturer extends User {

    @Column(name = "lecturer_id", unique = true, nullable = false, length = 50)
    private String lecturerId;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "email", nullable = false)
    private String email;

    // Specialization field removed as per requirements

    /**
     * Many-to-Many relationship with Subject
     * A lecturer can teach up to 3 subjects
     * joinTable creates the lecturer_subjects join table
     */
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "lecturer_subjects",
            joinColumns = @JoinColumn(name = "lecturer_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    // Default constructor
    public Lecturer() {
        super(Role.LECTURER);
    }

    // Constructor with parameters
    public Lecturer(String name, String username, String password, String lecturerId,
                    String department, String email) {
        super(Role.LECTURER);
        this.setName(name);
        this.setUsername(username);
        this.setPassword(password);
        this.lecturerId = lecturerId;
        this.department = department;
        this.email = email;
    }

    /**
     * Helper method to add a subject to lecturer
     * Checks if maximum limit (3 subjects) is reached
     */
    public void addSubject(Subject subject) {
        if (this.subjects.size() >= 3) {
            throw new RuntimeException("Lecturer can only teach up to 3 subjects");
        }
        this.subjects.add(subject);
        subject.getLecturers().add(this);
    }

    /**
     * Helper method to remove a subject from lecturer
     */
    public void removeSubject(Subject subject) {
        this.subjects.remove(subject);
        subject.getLecturers().remove(this);
    }

    /**
     * Get count of assigned subjects
     */
    public int getSubjectCount() {
        return this.subjects.size();
    }
}