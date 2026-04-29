package com.myanatomy.sandboxpro.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ResumeCommentDto {
    private Long id;
    private Long reviewId;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private String authorProfilePicture;
    private String content;
    private LocalDateTime createdAt;
}
