package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.ConnectionDto;
import com.myanatomy.sandboxpro.dto.ConversationDto;
import com.myanatomy.sandboxpro.dto.MessageDto;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.Connection;
import com.myanatomy.sandboxpro.model.Connection.ConnectionStatus;
import com.myanatomy.sandboxpro.model.Message;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.ConnectionRepository;
import com.myanatomy.sandboxpro.repository.MessageRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ── Connection management ─────────────────────────────────────────────────

    @Transactional
    public ConnectionDto sendRequest(Long receiverId, String requesterUsername) {
        User requester = findUser(requesterUsername);
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (requester.getId().equals(receiverId))
            throw new AppException("You cannot connect with yourself", HttpStatus.BAD_REQUEST);

        Optional<Connection> existing = connectionRepository.findBetween(requester, receiver);
        if (existing.isPresent()) {
            ConnectionStatus s = existing.get().getStatus();
            if (s == ConnectionStatus.ACCEPTED) throw new AppException("Already connected", HttpStatus.CONFLICT);
            if (s == ConnectionStatus.PENDING)  throw new AppException("Request already sent", HttpStatus.CONFLICT);
            if (s == ConnectionStatus.REJECTED || s == ConnectionStatus.WITHDRAWN) {
                // Allow re-sending
                Connection c = existing.get();
                c.setRequester(requester);
                c.setReceiver(receiver);
                c.setStatus(ConnectionStatus.PENDING);
                Connection saved = connectionRepository.save(c);
                notificationService.createConnectionRequestNotification(receiver, requester);
                return toDto(saved);
            }
        }

        Connection c = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .build();
        Connection saved = connectionRepository.save(c);
        notificationService.createConnectionRequestNotification(receiver, requester);
        log.info("{} sent connection request to {}", requesterUsername, receiver.getUsername());
        return toDto(saved);
    }

    @Transactional
    public ConnectionDto respondToRequest(Long connectionId, boolean accept, String receiverUsername) {
        Connection c = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new AppException("Connection request not found", HttpStatus.NOT_FOUND));

        if (!c.getReceiver().getUsername().equals(receiverUsername))
            throw new AppException("Access denied", HttpStatus.FORBIDDEN);

        if (c.getStatus() != ConnectionStatus.PENDING)
            throw new AppException("Request is no longer pending", HttpStatus.BAD_REQUEST);

        c.setStatus(accept ? ConnectionStatus.ACCEPTED : ConnectionStatus.REJECTED);
        Connection saved = connectionRepository.save(c);

        if (accept) {
            notificationService.createConnectionAcceptedNotification(c.getRequester(), c.getReceiver());
            log.info("{} accepted connection from {}", receiverUsername, c.getRequester().getUsername());
        }
        return toDto(saved);
    }

    @Transactional
    public void withdrawRequest(Long connectionId, String requesterUsername) {
        Connection c = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new AppException("Connection not found", HttpStatus.NOT_FOUND));

        if (!c.getRequester().getUsername().equals(requesterUsername))
            throw new AppException("Access denied", HttpStatus.FORBIDDEN);

        c.setStatus(ConnectionStatus.WITHDRAWN);
        connectionRepository.save(c);
    }

    @Transactional
    public void removeConnection(Long connectionId, String username) {
        Connection c = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new AppException("Connection not found", HttpStatus.NOT_FOUND));

        User user = findUser(username);
        boolean isParty = c.getRequester().getId().equals(user.getId()) ||
                          c.getReceiver().getId().equals(user.getId());
        if (!isParty) throw new AppException("Access denied", HttpStatus.FORBIDDEN);

        connectionRepository.delete(c);
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public List<ConnectionDto> getMyConnections(String username) {
        User user = findUser(username);
        return connectionRepository.findAcceptedConnections(user)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ConnectionDto> getPendingReceived(String username) {
        User user = findUser(username);
        return connectionRepository.findByReceiverAndStatusOrderByCreatedAtDesc(user, ConnectionStatus.PENDING)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ConnectionDto> getPendingSent(String username) {
        User user = findUser(username);
        return connectionRepository.findByRequesterAndStatusOrderByCreatedAtDesc(user, ConnectionStatus.PENDING)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Returns the connection status between the current user and another user */
    public String getConnectionStatus(Long otherUserId, String username) {
        User me = findUser(username);
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return connectionRepository.findBetween(me, other)
                .map(c -> c.getStatus().name())
                .orElse("NONE");
    }

    // ── Messaging ─────────────────────────────────────────────────────────────

    @Transactional
    public MessageDto sendMessage(Long receiverId, String content, String senderUsername) {
        User sender = findUser(senderUsername);
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // Enforce: must be connected to message
        Connection conn = connectionRepository.findBetween(sender, receiver)
                .orElseThrow(() -> new AppException("You must be connected to send messages", HttpStatus.FORBIDDEN));
        if (conn.getStatus() != ConnectionStatus.ACCEPTED)
            throw new AppException("You must be connected to send messages", HttpStatus.FORBIDDEN);

        if (content == null || content.isBlank())
            throw new AppException("Message cannot be empty", HttpStatus.BAD_REQUEST);

        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content.trim())
                .build();
        return toMessageDto(messageRepository.save(msg));
    }

    public List<MessageDto> getConversation(Long partnerId, String username) {
        User me = findUser(username);
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // Must be connected
        Connection conn = connectionRepository.findBetween(me, partner)
                .orElseThrow(() -> new AppException("Not connected", HttpStatus.FORBIDDEN));
        if (conn.getStatus() != ConnectionStatus.ACCEPTED)
            throw new AppException("Not connected", HttpStatus.FORBIDDEN);

        // Mark messages from partner as read
        messageRepository.markConversationAsRead(partner, me);

        return messageRepository.findConversation(me, partner)
                .stream().map(this::toMessageDto).collect(Collectors.toList());
    }

    public List<ConversationDto> getInbox(String username) {
        User me = findUser(username);
        List<Message> latestMessages = messageRepository.findLatestPerConversation(me.getId());

        return latestMessages.stream().map(msg -> {
            User partner = msg.getSender().getId().equals(me.getId()) ? msg.getReceiver() : msg.getSender();
            long unread = messageRepository.countBySenderAndReceiverAndIsReadFalse(partner, me);
            return ConversationDto.builder()
                    .partnerId(partner.getId())
                    .partnerName(partner.getFullName())
                    .partnerRole(partner.getUserRole() != null ? partner.getUserRole().name() : null)
                    .partnerProfilePicture(partner.getProfilePicture())
                    .partnerCompany(partner.getCurrentCompany())
                    .lastMessage(msg.getContent())
                    .lastMessageAt(msg.getSentAt())
                    .unreadCount(unread)
                    .build();
        }).collect(Collectors.toList());
    }

    public long getUnreadMessageCount(String username) {
        User me = findUser(username);
        return messageRepository.countByReceiverAndIsReadFalse(me);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private ConnectionDto toDto(Connection c) {
        return ConnectionDto.builder()
                .id(c.getId())
                .requesterId(c.getRequester().getId())
                .requesterName(c.getRequester().getFullName())
                .requesterRole(c.getRequester().getUserRole() != null ? c.getRequester().getUserRole().name() : null)
                .requesterProfilePicture(c.getRequester().getProfilePicture())
                .requesterCollege(c.getRequester().getCollege())
                .requesterCompany(c.getRequester().getCurrentCompany())
                .receiverId(c.getReceiver().getId())
                .receiverName(c.getReceiver().getFullName())
                .receiverRole(c.getReceiver().getUserRole() != null ? c.getReceiver().getUserRole().name() : null)
                .receiverProfilePicture(c.getReceiver().getProfilePicture())
                .receiverCollege(c.getReceiver().getCollege())
                .receiverCompany(c.getReceiver().getCurrentCompany())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    private MessageDto toMessageDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFullName())
                .senderProfilePicture(m.getSender().getProfilePicture())
                .receiverId(m.getReceiver().getId())
                .receiverName(m.getReceiver().getFullName())
                .receiverProfilePicture(m.getReceiver().getProfilePicture())
                .content(m.getContent())
                .isRead(m.getIsRead())
                .sentAt(m.getSentAt())
                .readAt(m.getReadAt())
                .build();
    }
}
