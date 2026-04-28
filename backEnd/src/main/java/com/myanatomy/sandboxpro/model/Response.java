package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "query_id", nullable = false)
    private Query query;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User mentor;

    @Builder.Default
    private Boolean isBestAnswer = false;
    @Builder.Default
    private Integer rating = 0;
    // True if this response was auto-served from the community/popular query pool
    @Builder.Default
    private Boolean isCommunityResponse = false;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
