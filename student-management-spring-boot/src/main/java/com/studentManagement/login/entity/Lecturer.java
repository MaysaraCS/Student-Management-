package com.studentManagement.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "lecturers")
@DiscriminatorValue("LECTURER")
public class Lecturer extends User {

    @Column(name = "lecturer_id", unique = true)
    private String lecturerId;

    @Column(name = "department")
    private String department;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "email")
    private String email;

    public Lecturer() {
        super(Role.LECTURER);
    }

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
}