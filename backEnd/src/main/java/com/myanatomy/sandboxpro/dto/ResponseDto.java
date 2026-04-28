package com.myanatomy.sandboxpro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDto {
    private Long id;
    private String content;
    private Long queryId;
    private Long mentorId;
    private String mentorName;
    private String mentorProfilePicture;
    private String mentorRole;
    private String mentorCompany;
    private Boolean isBestAnswer;
    private Integer rating;
    private LocalDateTime createdAt;
    // Whether this is a community/auto response (from popular query pool)
    private Boolean isCommunityResponse;
}
