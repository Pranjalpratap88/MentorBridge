package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.*;
import com.myanatomy.sandboxpro.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    // ── Connection requests ───────────────────────────────────────────────────

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<ApiResponse<ConnectionDto>> sendRequest(
            @PathVariable Long receiverId, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Request sent",
                    connectionService.sendRequest(receiverId, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ConnectionDto>> accept(
            @PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Connection accepted",
                    connectionService.respondToRequest(id, true, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ConnectionDto>> reject(
            @PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Request rejected",
                    connectionService.respondToRequest(id, false, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @PathVariable Long id, Authentication auth) {
        try {
            connectionService.withdrawRequest(id, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Request withdrawn", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> remove(
            @PathVariable Long id, Authentication auth) {
        try {
            connectionService.removeConnection(id, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Connection removed", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConnectionDto>>> getMyConnections(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Connections fetched",
                connectionService.getMyConnections(auth.getName())));
    }

    @GetMapping("/pending/received")
    public ResponseEntity<ApiResponse<List<ConnectionDto>>> getPendingReceived(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Pending requests fetched",
                connectionService.getPendingReceived(auth.getName())));
    }

    @GetMapping("/pending/sent")
    public ResponseEntity<ApiResponse<List<ConnectionDto>>> getPendingSent(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Sent requests fetched",
                connectionService.getPendingSent(auth.getName())));
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getStatus(
            @PathVariable Long userId, Authentication auth) {
        try {
            String status = connectionService.getConnectionStatus(userId, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Status fetched", Map.of("status", status)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Messages ──────────────────────────────────────────────────────────────

    @PostMapping("/messages/{receiverId}")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @PathVariable Long receiverId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        try {
            String content = body.get("content");
            return ResponseEntity.ok(ApiResponse.success("Message sent",
                    connectionService.sendMessage(receiverId, content, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/messages/{partnerId}")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversation(
            @PathVariable Long partnerId, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Conversation fetched",
                    connectionService.getConversation(partnerId, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/inbox")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getInbox(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Inbox fetched",
                connectionService.getInbox(auth.getName())));
    }

    @GetMapping("/messages/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication auth) {
        long count = connectionService.getUnreadMessageCount(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }
}
