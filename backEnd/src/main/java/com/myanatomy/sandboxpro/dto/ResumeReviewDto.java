package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.ResumeReviewEntity.ReviewStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ResumeReviewDto {
    private Long id;
    private Long resumeId;
    private String resumeTitle;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerRole;
    private String reviewerCompany;
    private String reviewerProfilePicture;
    private String overallFeedback;
    private String strengthsFeedback;
    private String improvementsFeedback;
    private String formattingFeedback;
    private String contentFeedback;
    private Integer rating;
    private ReviewStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ResumeCommentDto> comments;
}
