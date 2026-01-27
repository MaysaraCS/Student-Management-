package com.studentManagement.login.dto.lecturer;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LecturerLoginRequest {

    private String username; // Selected from dropdown

    private String password;
}