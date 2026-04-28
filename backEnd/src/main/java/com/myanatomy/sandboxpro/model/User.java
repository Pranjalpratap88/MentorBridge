package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    // Role-based fields
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole; // STUDENT, SENIOR_STUDENT, ALUMNI, MENTOR

    // Student/Senior Student fields
    private String college;
    private String graduationYear;
    private String degree;
    private String branch;

    // Alumni specific fields
    private String currentCompany;
    private String currentPosition;
    private String workExperience; // in years
    private String industry;
    private String linkedinProfile;
    private String achievements;

    // Common fields
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private Set<Role> roles; // System roles (ADMIN, USER, etc.)

    @Builder.Default
    private Integer reputationPoints = 0;
    private String profilePicture;
    private String bio;
    private String oauthProvider; // "google", "github", or null for local

    // Account verification
    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean emailVerified = false;
    private String emailVerificationToken;
    private LocalDateTime emailVerificationExpiry;

    // Password reset
    private String passwordResetToken;
    private LocalDateTime passwordResetExpiry;

    // Account status
    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean accountEnabled = true;
    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean accountLocked = false;

    // Timestamps
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}