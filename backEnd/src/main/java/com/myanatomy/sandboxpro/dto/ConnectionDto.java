package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Connection.ConnectionStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ConnectionDto {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterRole;
    private String requesterProfilePicture;
    private String requesterCollege;
    private String requesterCompany;
    private Long receiverId;
    private String receiverName;
    private String receiverRole;
    private String receiverProfilePicture;
    private String receiverCollege;
    private String receiverCompany;
    private ConnectionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
