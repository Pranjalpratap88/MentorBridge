package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who receives this notification
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    // The user who triggered the action (nullable for system notifications)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // Optional link to the related entity (e.g. /query/42)
    private String actionUrl;

    // Related query id (if applicable)
    private Long relatedQueryId;

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        PRIVATE_QUERY_RECEIVED,   // Someone sent you a private query
        QUERY_RESPONSE_RECEIVED,  // Your query got a response
        BEST_ANSWER_MARKED,       // Your response was marked best answer
        QUERY_ASSIGNED,           // A query was assigned/resent to you
        SYSTEM                    // Generic system notification
    }
}
