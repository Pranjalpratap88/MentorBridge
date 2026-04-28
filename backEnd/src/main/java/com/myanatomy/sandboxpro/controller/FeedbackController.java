package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.ApiResponse;
import com.myanatomy.sandboxpro.dto.FeedbackDto;
import com.myanatomy.sandboxpro.model.Feedback.FeedbackCategory;
import com.myanatomy.sandboxpro.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // ── Submit (any authenticated user) ──────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDto>> submitFeedback(
            @RequestBody FeedbackDto feedbackDto,
            Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : null;
            FeedbackDto saved = feedbackService.submitFeedback(feedbackDto, username);
            return ResponseEntity.ok(ApiResponse.success("Thank you for your feedback!", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── User: view own feedback ───────────────────────────────────────────────
    // IMPORTANT: this MUST be declared before /{id} so Spring doesn't
    // try to parse the literal string "my" as a Long path variable.

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getMyFeedback(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(ApiResponse.success("No feedback found", List.of()));
        }
        try {
            List<FeedbackDto> feedback = feedbackService.getFeedbackByUser(authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Your feedback fetched", feedback));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.success("No feedback found", List.of()));
        }
    }

    // ── Admin-only: stats ─────────────────────────────────────────────────────
    // Also declared before /{id} to avoid path-variable collision.

    @GetMapping("/stats/unreviewed-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getUnreviewedCount() {
        long count = feedbackService.getUnreviewedCount();
        return ResponseEntity.ok(ApiResponse.success("Unreviewed count fetched", count));
    }

    @GetMapping("/stats/average-rating")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Double>> getAverageRating() {
        Double avg = feedbackService.getAverageRating();
        return ResponseEntity.ok(ApiResponse.success("Average rating fetched", avg != null ? avg : 0.0));
    }

    // ── Admin-only: list endpoints ────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedback() {
        List<FeedbackDto> feedback = feedbackService.getAllFeedback();
        return ResponseEntity.ok(ApiResponse.success("Feedback fetched successfully", feedback));
    }

    @GetMapping("/unreviewed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getUnreviewedFeedback() {
        List<FeedbackDto> feedback = feedbackService.getUnreviewedFeedback();
        return ResponseEntity.ok(ApiResponse.success("Unreviewed feedback fetched", feedback));
    }

    @GetMapping("/reviewed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getReviewedFeedback() {
        List<FeedbackDto> feedback = feedbackService.getReviewedFeedback();
        return ResponseEntity.ok(ApiResponse.success("Reviewed feedback fetched", feedback));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getFeedbackByCategory(
            @PathVariable String category) {
        try {
            FeedbackCategory cat = FeedbackCategory.valueOf(category.toUpperCase());
            List<FeedbackDto> feedback = feedbackService.getFeedbackByCategory(cat);
            return ResponseEntity.ok(ApiResponse.success("Feedback by category fetched", feedback));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid category: " + category));
        }
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeedbackDto>> markAsReviewed(
            @PathVariable Long id,
            @RequestParam(required = false) String adminNotes) {
        try {
            FeedbackDto feedback = feedbackService.markAsReviewed(id, adminNotes);
            return ResponseEntity.ok(ApiResponse.success("Feedback marked as reviewed", feedback));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeedbackDto>> respondToFeedback(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body,
            Authentication authentication) {
        try {
            String response = body.get("response");
            if (response == null || response.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Response message is required"));
            }
            FeedbackDto feedback = feedbackService.respondToFeedback(id, response, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Response sent successfully", feedback));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Admin-only: single record — declared LAST to avoid swallowing literals ─

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeedbackDto>> getFeedbackById(@PathVariable Long id) {
        try {
            FeedbackDto feedback = feedbackService.getFeedbackById(id);
            return ResponseEntity.ok(ApiResponse.success("Feedback fetched successfully", feedback));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
