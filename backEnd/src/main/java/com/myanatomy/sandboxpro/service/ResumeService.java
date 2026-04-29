package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.ResumeCommentDto;
import com.myanatomy.sandboxpro.dto.ResumeDto;
import com.myanatomy.sandboxpro.dto.ResumeReviewDto;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.*;
import com.myanatomy.sandboxpro.model.Resume.ResumeStatus;
import com.myanatomy.sandboxpro.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeReviewRepository reviewRepository;
    private final ResumeCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.resume.upload-dir:uploads/resumes}")
    private String uploadDir;

    // ── Upload ────────────────────────────────────────────────────────────────

    @Transactional
    public ResumeDto uploadResume(MultipartFile file, String title, String username) throws IOException {
        User owner = findUser(username);

        if (file.isEmpty()) throw new AppException("File is empty", HttpStatus.BAD_REQUEST);
        if (!isPdf(file)) throw new AppException("Only PDF files are supported", HttpStatus.BAD_REQUEST);
        if (file.getSize() > 5 * 1024 * 1024) throw new AppException("File size must be under 5MB", HttpStatus.BAD_REQUEST);

        // Ensure upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String storedName = UUID.randomUUID() + ".pdf";
        Path filePath = uploadPath.resolve(storedName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Resume resume = Resume.builder()
                .owner(owner)
                .originalFileName(file.getOriginalFilename())
                .storedFileName(storedName)
                .filePath(filePath.toString())
                .fileSizeBytes(file.getSize())
                .title(title != null && !title.isBlank() ? title : file.getOriginalFilename())
                .status(ResumeStatus.ACTIVE)
                .visibleToRoles("ALUMNI,MENTOR")
                .reviewRequestOpen(false)
                .build();

        Resume saved = resumeRepository.save(resume);
        log.info("Resume uploaded by {} — {}", username, storedName);
        return toDto(saved, false);
    }

    // ── My Resumes ────────────────────────────────────────────────────────────

    public List<ResumeDto> getMyResumes(String username) {
        User owner = findUser(username);
        return resumeRepository.findByOwnerAndStatusNotOrderByUploadedAtDesc(owner, ResumeStatus.DELETED)
                .stream().map(r -> toDto(r, false)).collect(Collectors.toList());
    }

    public ResumeDto getResumeById(Long id, String username) {
        Resume resume = findResume(id);
        User requester = findUser(username);
        assertCanView(resume, requester);
        return toDto(resume, true);
    }

    // ── Update settings ───────────────────────────────────────────────────────

    @Transactional
    public ResumeDto updateResumeSettings(Long id, String title, String visibleToRoles,
                                           String visibleToUserIds, Boolean reviewRequestOpen,
                                           String reviewNote, String username) {
        Resume resume = findResume(id);
        assertOwner(resume, username);

        if (title != null && !title.isBlank()) resume.setTitle(title);
        if (visibleToRoles != null) resume.setVisibleToRoles(visibleToRoles);
        if (visibleToUserIds != null) resume.setVisibleToUserIds(visibleToUserIds);
        if (reviewRequestOpen != null) resume.setReviewRequestOpen(reviewRequestOpen);
        if (reviewNote != null) resume.setReviewNote(reviewNote);

        return toDto(resumeRepository.save(resume), false);
    }

    @Transactional
    public ResumeDto archiveResume(Long id, String username) {
        Resume resume = findResume(id);
        assertOwner(resume, username);
        resume.setStatus(ResumeStatus.ARCHIVED);
        resume.setReviewRequestOpen(false);
        return toDto(resumeRepository.save(resume), false);
    }

    @Transactional
    public ResumeDto restoreResume(Long id, String username) {
        Resume resume = findResume(id);
        assertOwner(resume, username);
        resume.setStatus(ResumeStatus.ACTIVE);
        return toDto(resumeRepository.save(resume), false);
    }

    @Transactional
    public void deleteResume(Long id, String username) throws IOException {
        Resume resume = findResume(id);
        assertOwner(resume, username);
        // Delete file from disk
        try { Files.deleteIfExists(Paths.get(resume.getFilePath())); } catch (IOException ignored) {}
        resume.setStatus(ResumeStatus.DELETED);
        resumeRepository.save(resume);
    }

    // ── Download ──────────────────────────────────────────────────────────────

    public Path getFilePath(Long id, String username) {
        Resume resume = findResume(id);
        User requester = findUser(username);
        assertCanView(resume, requester);
        return Paths.get(resume.getFilePath());
    }

    public String getOriginalFileName(Long id) {
        return findResume(id).getOriginalFileName();
    }

    // ── Browse (for reviewers) ────────────────────────────────────────────────

    public List<ResumeDto> getResumesOpenForReview(String username) {
        User reviewer = findUser(username);
        String role = reviewer.getUserRole().name();
        return resumeRepository.findOpenForReviewByRole(role)
                .stream()
                .filter(r -> !r.getOwner().getId().equals(reviewer.getId()))
                .filter(r -> canView(r, reviewer))
                .map(r -> toDto(r, false))
                .collect(Collectors.toList());
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    @Transactional
    public ResumeReviewDto submitReview(Long resumeId, ResumeReviewDto dto, String reviewerUsername) {
        Resume resume = findResume(resumeId);
        User reviewer = findUser(reviewerUsername);

        if (resume.getOwner().getId().equals(reviewer.getId()))
            throw new AppException("You cannot review your own resume", HttpStatus.BAD_REQUEST);
        assertCanView(resume, reviewer);

        // Check if already reviewed — update instead
        ResumeReviewEntity existing = reviewRepository.findByResumeAndReviewer(resume, reviewer).orElse(null);

        ResumeReviewEntity review;
        if (existing != null) {
            existing.setOverallFeedback(dto.getOverallFeedback());
            existing.setStrengthsFeedback(dto.getStrengthsFeedback());
            existing.setImprovementsFeedback(dto.getImprovementsFeedback());
            existing.setFormattingFeedback(dto.getFormattingFeedback());
            existing.setContentFeedback(dto.getContentFeedback());
            existing.setRating(dto.getRating());
            review = reviewRepository.save(existing);
        } else {
            review = ResumeReviewEntity.builder()
                    .resume(resume)
                    .reviewer(reviewer)
                    .overallFeedback(dto.getOverallFeedback())
                    .strengthsFeedback(dto.getStrengthsFeedback())
                    .improvementsFeedback(dto.getImprovementsFeedback())
                    .formattingFeedback(dto.getFormattingFeedback())
                    .contentFeedback(dto.getContentFeedback())
                    .rating(dto.getRating())
                    .build();
            review = reviewRepository.save(review);

            // Reward reviewer
            reviewer.setReputationPoints(reviewer.getReputationPoints() + 10);
            userRepository.save(reviewer);

            // Notify resume owner
            notificationService.createResumeReviewNotification(
                    resume.getOwner(), reviewer, resumeId, resume.getTitle());
        }

        return toReviewDto(review, true);
    }

    public List<ResumeReviewDto> getReviewsForResume(Long resumeId, String username) {
        Resume resume = findResume(resumeId);
        User requester = findUser(username);
        assertCanView(resume, requester);
        return reviewRepository.findByResumeOrderByCreatedAtDesc(resume)
                .stream().map(r -> toReviewDto(r, true)).collect(Collectors.toList());
    }

    public List<ResumeReviewDto> getMyReviews(String username) {
        User reviewer = findUser(username);
        return reviewRepository.findByReviewerOrderByCreatedAtDesc(reviewer)
                .stream().map(r -> toReviewDto(r, false)).collect(Collectors.toList());
    }

    // ── Comments ──────────────────────────────────────────────────────────────

    @Transactional
    public ResumeCommentDto addComment(Long reviewId, String content, String username) {
        ResumeReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException("Review not found", HttpStatus.NOT_FOUND));
        User author = findUser(username);

        // Only resume owner or reviewer can comment
        boolean isOwner = review.getResume().getOwner().getId().equals(author.getId());
        boolean isReviewer = review.getReviewer().getId().equals(author.getId());
        if (!isOwner && !isReviewer)
            throw new AppException("You cannot comment on this review", HttpStatus.FORBIDDEN);

        ResumeComment comment = ResumeComment.builder()
                .review(review)
                .author(author)
                .content(content)
                .build();

        return toCommentDto(commentRepository.save(comment));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private Resume findResume(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new AppException("Resume not found", HttpStatus.NOT_FOUND));
    }

    private void assertOwner(Resume resume, String username) {
        if (!resume.getOwner().getUsername().equals(username))
            throw new AppException("Access denied", HttpStatus.FORBIDDEN);
    }

    private void assertCanView(Resume resume, User requester) {
        if (!canView(resume, requester))
            throw new AppException("You don't have permission to view this resume", HttpStatus.FORBIDDEN);
    }

    private boolean canView(Resume resume, User requester) {
        // Owner can always view
        if (resume.getOwner().getId().equals(requester.getId())) return true;
        // Deleted resumes not visible
        if (resume.getStatus() == ResumeStatus.DELETED) return false;

        String roles = resume.getVisibleToRoles();
        String userIds = resume.getVisibleToUserIds();

        // Check specific user IDs
        if (userIds != null && !userIds.isBlank()) {
            for (String idStr : userIds.split(",")) {
                try {
                    if (Long.parseLong(idStr.trim()) == requester.getId()) return true;
                } catch (NumberFormatException ignored) {}
            }
        }

        // Check role visibility
        if (roles != null && !roles.isBlank()) {
            String requesterRole = requester.getUserRole().name();
            for (String role : roles.split(",")) {
                if (role.trim().equalsIgnoreCase(requesterRole)) return true;
            }
        }

        return false;
    }

    private boolean isPdf(MultipartFile file) {
        String ct = file.getContentType();
        String name = file.getOriginalFilename();
        return "application/pdf".equals(ct) || (name != null && name.toLowerCase().endsWith(".pdf"));
    }

    // ── Mappers ───────────────────────────────────────────────────────────────

    private ResumeDto toDto(Resume r, boolean includeReviews) {
        int reviewCount = r.getReviews() != null ? r.getReviews().size() : 0;
        return ResumeDto.builder()
                .id(r.getId())
                .ownerId(r.getOwner().getId())
                .ownerName(r.getOwner().getFullName())
                .ownerRole(r.getOwner().getUserRole() != null ? r.getOwner().getUserRole().name() : null)
                .ownerCollege(r.getOwner().getCollege())
                .ownerProfilePicture(r.getOwner().getProfilePicture())
                .originalFileName(r.getOriginalFileName())
                .title(r.getTitle())
                .fileSizeBytes(r.getFileSizeBytes())
                .status(r.getStatus())
                .visibleToRoles(r.getVisibleToRoles())
                .visibleToUserIds(r.getVisibleToUserIds())
                .reviewRequestOpen(r.getReviewRequestOpen())
                .reviewNote(r.getReviewNote())
                .uploadedAt(r.getUploadedAt())
                .reviewCount(reviewCount)
                .reviews(includeReviews && r.getReviews() != null
                        ? r.getReviews().stream().map(rv -> toReviewDto(rv, true)).collect(Collectors.toList())
                        : null)
                .build();
    }

    private ResumeReviewDto toReviewDto(ResumeReviewEntity rv, boolean includeComments) {
        return ResumeReviewDto.builder()
                .id(rv.getId())
                .resumeId(rv.getResume().getId())
                .resumeTitle(rv.getResume().getTitle())
                .reviewerId(rv.getReviewer().getId())
                .reviewerName(rv.getReviewer().getFullName())
                .reviewerRole(rv.getReviewer().getUserRole() != null ? rv.getReviewer().getUserRole().name() : null)
                .reviewerCompany(rv.getReviewer().getCurrentCompany())
                .reviewerProfilePicture(rv.getReviewer().getProfilePicture())
                .overallFeedback(rv.getOverallFeedback())
                .strengthsFeedback(rv.getStrengthsFeedback())
                .improvementsFeedback(rv.getImprovementsFeedback())
                .formattingFeedback(rv.getFormattingFeedback())
                .contentFeedback(rv.getContentFeedback())
                .rating(rv.getRating())
                .status(rv.getStatus())
                .createdAt(rv.getCreatedAt())
                .updatedAt(rv.getUpdatedAt())
                .comments(includeComments && rv.getComments() != null
                        ? rv.getComments().stream().map(this::toCommentDto).collect(Collectors.toList())
                        : null)
                .build();
    }

    private ResumeCommentDto toCommentDto(ResumeComment c) {
        return ResumeCommentDto.builder()
                .id(c.getId())
                .reviewId(c.getReview().getId())
                .authorId(c.getAuthor().getId())
                .authorName(c.getAuthor().getFullName())
                .authorRole(c.getAuthor().getUserRole() != null ? c.getAuthor().getUserRole().name() : null)
                .authorProfilePicture(c.getAuthor().getProfilePicture())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
