package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String storedFileName; // UUID-based name on disk

    @Column(nullable = false)
    private String filePath;

    private Long fileSizeBytes;

    @Column(nullable = false)
    private String title; // user-given label e.g. "Software Engineer Resume v2"

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ResumeStatus status = ResumeStatus.ACTIVE;

    // Visibility: who can see this resume for review
    // Stored as comma-separated roles: SENIOR_STUDENT,ALUMNI,MENTOR or PRIVATE
    @Builder.Default
    private String visibleToRoles = "ALUMNI,MENTOR"; // default: alumni + mentors

    // Specific users allowed to review (comma-separated user IDs, optional)
    private String visibleToUserIds;

    @Builder.Default
    private Boolean reviewRequestOpen = false; // true = actively seeking reviews

    private String reviewNote; // message to reviewers

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeReviewEntity> reviews;

    public enum ResumeStatus {
        ACTIVE, ARCHIVED, DELETED
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
