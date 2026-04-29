package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.ApiResponse;
import com.myanatomy.sandboxpro.dto.ResumeCommentDto;
import com.myanatomy.sandboxpro.dto.ResumeDto;
import com.myanatomy.sandboxpro.dto.ResumeReviewDto;
import com.myanatomy.sandboxpro.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // ── Upload ────────────────────────────────────────────────────────────────

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeDto>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            Authentication auth) {
        try {
            ResumeDto dto = resumeService.uploadResume(file, title, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── My resumes ────────────────────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getMyResumes(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Resumes fetched",
                resumeService.getMyResumes(auth.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeDto>> getById(@PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Resume fetched",
                    resumeService.getResumeById(id, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Download PDF ──────────────────────────────────────────────────────────

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id, Authentication auth) {
        try {
            Path filePath = resumeService.getFilePath(id, auth.getName());
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) return ResponseEntity.notFound().build();
            String filename = resumeService.getOriginalFileName(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ── Settings ──────────────────────────────────────────────────────────────

    @PutMapping("/{id}/settings")
    public ResponseEntity<ApiResponse<ResumeDto>> updateSettings(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        try {
            String title = (String) body.get("title");
            String visibleToRoles = (String) body.get("visibleToRoles");
            String visibleToUserIds = (String) body.get("visibleToUserIds");
            Boolean reviewRequestOpen = body.get("reviewRequestOpen") != null
                    ? (Boolean) body.get("reviewRequestOpen") : null;
            String reviewNote = (String) body.get("reviewNote");
            ResumeDto dto = resumeService.updateResumeSettings(
                    id, title, visibleToRoles, visibleToUserIds, reviewRequestOpen, reviewNote, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Settings updated", dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<ResumeDto>> archive(@PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Archived", resumeService.archiveResume(id, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<ResumeDto>> restore(@PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Restored", resumeService.restoreResume(id, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, Authentication auth) {
        try {
            resumeService.deleteResume(id, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Browse (for reviewers) ────────────────────────────────────────────────

    @GetMapping("/open-for-review")
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getOpenForReview(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Resumes fetched",
                resumeService.getResumesOpenForReview(auth.getName())));
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<ResumeReviewDto>> submitReview(
            @PathVariable Long id,
            @RequestBody ResumeReviewDto dto,
            Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Review submitted",
                    resumeService.submitReview(id, dto, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<List<ResumeReviewDto>>> getReviews(
            @PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Reviews fetched",
                    resumeService.getReviewsForResume(id, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<ApiResponse<List<ResumeReviewDto>>> getMyReviews(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("My reviews fetched",
                resumeService.getMyReviews(auth.getName())));
    }

    // ── Comments ──────────────────────────────────────────────────────────────

    @PostMapping("/reviews/{reviewId}/comments")
    public ResponseEntity<ApiResponse<ResumeCommentDto>> addComment(
            @PathVariable Long reviewId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        try {
            String content = body.get("content");
            if (content == null || content.isBlank())
                return ResponseEntity.badRequest().body(ApiResponse.error("Comment cannot be empty"));
            return ResponseEntity.ok(ApiResponse.success("Comment added",
                    resumeService.addComment(reviewId, content, auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
