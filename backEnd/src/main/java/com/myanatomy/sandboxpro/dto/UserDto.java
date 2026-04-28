package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private UserRole userRole;
    
    // Student/Senior Student fields
    private String college;
    private String graduationYear;
    private String degree;
    private String branch;
    
    // Alumni/Mentor fields
    private String currentCompany;
    private String currentPosition;
    private String workExperience;
    private String industry;
    private String linkedinProfile;
    private String achievements;
    
    // Common fields
    private Set<Role> roles;
    private Integer reputationPoints;
    private String profilePicture;
    private String bio;
    private String oauthProvider;
    
    // Account status
    private Boolean emailVerified;
    private Boolean accountEnabled;
    private Boolean accountLocked;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
