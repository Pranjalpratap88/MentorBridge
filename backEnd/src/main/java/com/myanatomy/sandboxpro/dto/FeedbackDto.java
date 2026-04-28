package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Feedback;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String name;
    private String email;
    private String message;
    private Integer rating;
    private Feedback.FeedbackCategory category;
    private Boolean isReviewed;
    private String adminNotes;
    private String adminResponse;
    private String respondedByName;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime respondedAt;
}
