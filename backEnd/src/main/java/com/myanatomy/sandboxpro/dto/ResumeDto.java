package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Resume.ResumeStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ResumeDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerRole;
    private String ownerCollege;
    private String ownerProfilePicture;
    private String originalFileName;
    private String title;
    private Long fileSizeBytes;
    private ResumeStatus status;
    private String visibleToRoles;
    private String visibleToUserIds;
    private Boolean reviewRequestOpen;
    private String reviewNote;
    private LocalDateTime uploadedAt;
    private int reviewCount;
    private List<ResumeReviewDto> reviews;
}
