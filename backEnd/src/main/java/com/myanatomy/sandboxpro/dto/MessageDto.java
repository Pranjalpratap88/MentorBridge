package com.myanatomy.sandboxpro.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderProfilePicture;
    private Long receiverId;
    private String receiverName;
    private String receiverProfilePicture;
    private String content;
    private Boolean isRead;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
}
