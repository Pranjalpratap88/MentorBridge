package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.NotificationDto;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.Notification;
import com.myanatomy.sandboxpro.model.Notification.NotificationType;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.NotificationRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ── Create helpers (called from QueryServiceImpl) ─────────────────────────

    @Transactional
    public void createPrivateQueryNotification(User recipient, User actor, Long queryId, String queryTitle) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.PRIVATE_QUERY_RECEIVED)
                .title("New private query from " + actor.getFullName())
                .message(actor.getFullName() + " sent you a private query: \"" + truncate(queryTitle, 80) + "\"")
                .actionUrl("/query/" + queryId)
                .relatedQueryId(queryId)
                .build();
        notificationRepository.save(n);
        log.info("Private query notification created for user {}", recipient.getUsername());
    }

    @Transactional
    public void createResponseNotification(User recipient, User actor, Long queryId, String queryTitle) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.QUERY_RESPONSE_RECEIVED)
                .title(actor.getFullName() + " responded to your query")
                .message("\"" + truncate(queryTitle, 80) + "\" received a new response.")
                .actionUrl("/query/" + queryId)
                .relatedQueryId(queryId)
                .build();
        notificationRepository.save(n);
    }

    @Transactional
    public void createBestAnswerNotification(User recipient, User actor, Long queryId, String queryTitle) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.BEST_ANSWER_MARKED)
                .title("Your answer was marked as best!")
                .message(actor.getFullName() + " marked your response as the best answer for \"" + truncate(queryTitle, 80) + "\"")
                .actionUrl("/query/" + queryId)
                .relatedQueryId(queryId)
                .build();
        notificationRepository.save(n);
    }

    @Transactional
    public void createQueryAssignedNotification(User recipient, User actor, Long queryId, String queryTitle) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.QUERY_ASSIGNED)
                .title("A query was assigned to you")
                .message(actor.getFullName() + " assigned a query to you: \"" + truncate(queryTitle, 80) + "\"")
                .actionUrl("/query/" + queryId)
                .relatedQueryId(queryId)
                .build();
        notificationRepository.save(n);
    }

    @Transactional
    public void createResumeReviewNotification(User recipient, User actor, Long resumeId, String resumeTitle) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.QUERY_RESPONSE_RECEIVED) // reuse type for now
                .title(actor.getFullName() + " reviewed your resume")
                .message("\"" + truncate(resumeTitle, 80) + "\" received a new review from " + actor.getFullName())
                .actionUrl("/resume")
                .relatedQueryId(resumeId)
                .build();
        notificationRepository.save(n);
    }

    @Transactional
    public void createConnectionRequestNotification(User recipient, User actor) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.QUERY_ASSIGNED)
                .title(actor.getFullName() + " wants to connect")
                .message(actor.getFullName() + " sent you a connection request")
                .actionUrl("/connections")
                .build();
        notificationRepository.save(n);
    }

    @Transactional
    public void createConnectionAcceptedNotification(User recipient, User actor) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(NotificationType.QUERY_ASSIGNED)
                .title(actor.getFullName() + " accepted your request")
                .message("You are now connected with " + actor.getFullName() + ". You can now message each other.")
                .actionUrl("/messages")
                .build();
        notificationRepository.save(n);
    }

    // ── Read operations ───────────────────────────────────────────────────────

    public List<NotificationDto> getNotificationsForUser(String username) {
        User user = findUser(username);
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotifications(String username) {
        User user = findUser(username);
        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public long getUnreadCount(String username) {
        User user = findUser(username);
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, String username) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException("Notification not found", HttpStatus.NOT_FOUND));
        if (!n.getRecipient().getUsername().equals(username)) {
            throw new AppException("Access denied", HttpStatus.FORBIDDEN);
        }
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead(String username) {
        User user = findUser(username);
        notificationRepository.markAllAsReadForUser(user);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private String truncate(String text, int maxLen) {
        if (text == null) return "";
        return text.length() <= maxLen ? text : text.substring(0, maxLen) + "...";
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .actionUrl(n.getActionUrl())
                .relatedQueryId(n.getRelatedQueryId())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .actorId(n.getActor() != null ? n.getActor().getId() : null)
                .actorName(n.getActor() != null ? n.getActor().getFullName() : null)
                .actorProfilePicture(n.getActor() != null ? n.getActor().getProfilePicture() : null)
                .build();
    }
}
