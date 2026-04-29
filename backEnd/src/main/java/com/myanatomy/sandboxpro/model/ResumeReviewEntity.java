package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "resume_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String overallFeedback;

    // Structured feedback sections
    @Column(columnDefinition = "TEXT")
    private String strengthsFeedback;

    @Column(columnDefinition = "TEXT")
    private String improvementsFeedback;

    @Column(columnDefinition = "TEXT")
    private String formattingFeedback;

    @Column(columnDefinition = "TEXT")
    private String contentFeedback;

    // Rating 1-5
    private Integer rating;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReviewStatus status = ReviewStatus.SUBMITTED;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // Comments thread on this review
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeComment> comments;

    public enum ReviewStatus {
        SUBMITTED, ACKNOWLEDGED
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
