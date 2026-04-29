package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "queries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Query {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String tags;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private QueryStatus status = QueryStatus.OPEN;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    // Who the query is directed to (optional - null means broadcast to all)
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    // Target role filter: SENIOR_STUDENT, ALUMNI, MENTOR, or null for all
    @Enumerated(EnumType.STRING)
    private UserRole targetRole;

    // Target roles (for multi-select): comma-separated list of roles
    private String targetRoles;

    // How many times this same/similar query has been asked
    @Builder.Default
    private Integer popularCount = 1;

    // Auto-flagged when popularCount >= 10
    @Builder.Default
    private Boolean isPopular = false;

    // Upvotes — users marking a query as helpful/relatable
    @Builder.Default
    private Integer upvoteCount = 0;

    // Comma-separated user IDs who upvoted (to prevent double-voting)
    @Column(columnDefinition = "TEXT")
    private String upvotedByIds;

    // Whether the student was satisfied with the community answer
    @Builder.Default
    private Boolean satisfiedWithCommunityAnswer = false;

    // True = private query (only visible to the assigned user and the sender)
    @Builder.Default
    private Boolean isPrivate = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "query", cascade = CascadeType.ALL)
    private List<Response> responses;
}
