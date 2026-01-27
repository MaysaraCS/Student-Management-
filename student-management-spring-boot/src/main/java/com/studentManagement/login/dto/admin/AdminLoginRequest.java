package com.studentManagement.login.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLoginRequest {

    private String email;

    private String oauthToken; // OAuth token from Google

    private String oauthProvider; // "GOOGLE"
}