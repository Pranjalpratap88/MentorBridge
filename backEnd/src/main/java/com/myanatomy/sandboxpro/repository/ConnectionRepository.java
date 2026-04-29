package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Connection;
import com.myanatomy.sandboxpro.model.Connection.ConnectionStatus;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Find connection between two users (either direction)
    @Query("SELECT c FROM Connection c WHERE (c.requester = :a AND c.receiver = :b) OR (c.requester = :b AND c.receiver = :a)")
    Optional<Connection> findBetween(@Param("a") User a, @Param("b") User b);

    // All accepted connections for a user
    @Query("SELECT c FROM Connection c WHERE (c.requester = :user OR c.receiver = :user) AND c.status = 'ACCEPTED' ORDER BY c.updatedAt DESC")
    List<Connection> findAcceptedConnections(@Param("user") User user);

    // Pending requests received by a user
    List<Connection> findByReceiverAndStatusOrderByCreatedAtDesc(User receiver, ConnectionStatus status);

    // Pending requests sent by a user
    List<Connection> findByRequesterAndStatusOrderByCreatedAtDesc(User requester, ConnectionStatus status);

    // Count accepted connections
    @Query("SELECT COUNT(c) FROM Connection c WHERE (c.requester = :user OR c.receiver = :user) AND c.status = 'ACCEPTED'")
    long countAcceptedConnections(@Param("user") User user);
}
