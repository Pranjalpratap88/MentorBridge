package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private String actionUrl;
    private Long relatedQueryId;
    private Boolean isRead;
    private LocalDateTime createdAt;

    // Actor info
    private Long actorId;
    private String actorName;
    private String actorProfilePicture;
}
