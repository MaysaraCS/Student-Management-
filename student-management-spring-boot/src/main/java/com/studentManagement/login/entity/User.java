// Base Entity
package com.studentManagement.login.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String address;

    private String mobileNo;

    @Column(unique = true)
    private String username;

    private String password;

}

//OOP Concepts to use later:
//Inheritance - Admin, Lecturer, and Student all inherit from the base User class
//Abstraction - User is an abstract class that cannot be instantiated directly
//Encapsulation - Using Lombok's @Getter and @Setter to encapsulate fields
//Polymorphism - All three types can be treated as User objects when needed