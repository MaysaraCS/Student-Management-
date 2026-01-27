package com.studentManagement.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "oauth_provider")
    private String oauthProvider; // e.g., "GOOGLE"

    @Column(name = "oauth_id")
    private String oauthId;

    public Admin() {
        super(Role.ADMIN);
    }

    public Admin(String name, String email, String oauthProvider, String oauthId) {
        super(Role.ADMIN);
        this.setName(name);
        this.email = email;
        this.oauthProvider = oauthProvider;
        this.oauthId = oauthId;
        // Admin uses OAuth, so username can be email
        this.setUsername(email);
    }
}