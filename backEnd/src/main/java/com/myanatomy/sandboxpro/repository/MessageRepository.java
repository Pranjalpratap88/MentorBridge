package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Message;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // All messages between two users, ordered by time
    @Query("SELECT m FROM Message m WHERE (m.sender = :a AND m.receiver = :b) OR (m.sender = :b AND m.receiver = :a) ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("a") User a, @Param("b") User b);

    // Latest message per conversation partner (for inbox)
    @Query(value = """
        SELECT m.* FROM messages m
        INNER JOIN (
            SELECT LEAST(sender_id, receiver_id) AS u1,
                   GREATEST(sender_id, receiver_id) AS u2,
                   MAX(sent_at) AS max_sent
            FROM messages
            WHERE sender_id = :userId OR receiver_id = :userId
            GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
        ) latest ON LEAST(m.sender_id, m.receiver_id) = latest.u1
                AND GREATEST(m.sender_id, m.receiver_id) = latest.u2
                AND m.sent_at = latest.max_sent
        ORDER BY m.sent_at DESC
        """, nativeQuery = true)
    List<Message> findLatestPerConversation(@Param("userId") Long userId);

    // Unread count from a specific sender
    long countBySenderAndReceiverAndIsReadFalse(User sender, User receiver);

    // Total unread for a user
    long countByReceiverAndIsReadFalse(User receiver);

    // Mark all messages from sender to receiver as read
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP WHERE m.sender = :sender AND m.receiver = :receiver AND m.isRead = false")
    void markConversationAsRead(@Param("sender") User sender, @Param("receiver") User receiver);
}
