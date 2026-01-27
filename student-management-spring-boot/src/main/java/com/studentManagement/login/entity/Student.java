package com.studentManagement.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
public class Student extends User {

    @Column(name = "student_id", unique = true, nullable = false)
    private String studentId;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Column(name = "enrollment_date")
    private java.time.LocalDate enrollmentDate;

    public Student() {
        super(Role.STUDENT);
    }

    public Student(String name, String username, String password, String studentId,
                   String mobileNo, String faculty) {
        super(Role.STUDENT);
        this.setName(name);
        this.setUsername(username);
        this.setPassword(password);
        this.studentId = studentId;
        this.setMobileNo(mobileNo);
        this.faculty = faculty;
        this.enrollmentDate = java.time.LocalDate.now();
    }
}