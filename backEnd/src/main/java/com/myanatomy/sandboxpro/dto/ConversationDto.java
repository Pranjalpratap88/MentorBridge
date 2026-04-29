package com.myanatomy.sandboxpro.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ConversationDto {
    private Long partnerId;
    private String partnerName;
    private String partnerRole;
    private String partnerProfilePicture;
    private String partnerCompany;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
    private boolean isOnline; // placeholder for future
}
