package com.myanatomy.sandboxpro.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.myanatomy.sandboxpro.model.QueryStatus;
import com.myanatomy.sandboxpro.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueryDto {
    private Long id;
    private String title;
    private String content;
    private String tags;
    private QueryStatus status;
    private Long studentId;
    private String studentName;
    private String studentProfilePicture;
    private Long assignedToId;
    private String assignedToName;
    private UserRole targetRole;

    // Outbound: comma-separated string for display (serialized as "targetRolesStr")
    @JsonProperty("targetRolesStr")
    private String targetRoles;

    // Inbound from frontend: array of role strings (deserialized from "targetRoles")
    @JsonProperty("targetRoles")
    private List<String> targetRoleList;

    // Inbound from frontend: multiple recipient IDs
    private List<Long> assignedToIds;

    private Integer popularCount;
    private Boolean isPopular;
    private Integer upvoteCount;
    private Boolean hasUpvoted;
    private Boolean satisfiedWithCommunityAnswer;
    private Boolean isPrivate;
    private LocalDateTime createdAt;
    private List<ResponseDto> responses;
    private Integer responseCount;
}
