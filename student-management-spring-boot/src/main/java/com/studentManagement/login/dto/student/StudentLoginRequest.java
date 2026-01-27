package com.studentManagement.login.dto.student;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentLoginRequest {

    private String username;

    private String password;
}