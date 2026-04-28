package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.FeedbackDto;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.Feedback;
import com.myanatomy.sandboxpro.model.Feedback.FeedbackCategory;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.FeedbackRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Transactional
    public FeedbackDto submitFeedback(FeedbackDto feedbackDto, String username) {
        User user = null;
        if (username != null) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        if (feedbackDto.getRating() < 1 || feedbackDto.getRating() > 5) {
            throw new AppException("Rating must be between 1 and 5", HttpStatus.BAD_REQUEST);
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .name(feedbackDto.getName())
                .email(feedbackDto.getEmail())
                .message(feedbackDto.getMessage())
                .rating(feedbackDto.getRating())
                .category(feedbackDto.getCategory() != null ? feedbackDto.getCategory() : FeedbackCategory.GENERAL)
                .isReviewed(false)
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        log.info("Feedback submitted by {} with rating {}", feedbackDto.getEmail(), feedbackDto.getRating());
        return toDto(saved);
    }

    public List<FeedbackDto> getAllFeedback() {
        return feedbackRepository.findByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getUnreviewedFeedback() {
        return feedbackRepository.findByIsReviewedFalseOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getReviewedFeedback() {
        return feedbackRepository.findByIsReviewedTrueOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getFeedbackByCategory(FeedbackCategory category) {
        return feedbackRepository.findByCategoryOrderByCreatedAtDesc(category).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public FeedbackDto getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException("Feedback not found", HttpStatus.NOT_FOUND));
        return toDto(feedback);
    }

    @Transactional
    public FeedbackDto markAsReviewed(Long id, String adminNotes) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException("Feedback not found", HttpStatus.NOT_FOUND));
        feedback.setIsReviewed(true);
        feedback.setAdminNotes(adminNotes);
        feedback.setReviewedAt(LocalDateTime.now());
        Feedback saved = feedbackRepository.save(feedback);
        log.info("Feedback {} marked as reviewed", id);
        return toDto(saved);
    }

    @Transactional
    public FeedbackDto respondToFeedback(Long id, String response, String adminUsername) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException("Feedback not found", HttpStatus.NOT_FOUND));
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new AppException("Admin not found", HttpStatus.NOT_FOUND));
        feedback.setAdminResponse(response);
        feedback.setRespondedBy(admin);
        feedback.setRespondedAt(LocalDateTime.now());
        feedback.setIsReviewed(true);
        feedback.setReviewedAt(LocalDateTime.now());
        Feedback saved = feedbackRepository.save(feedback);
        log.info("Admin {} responded to feedback {}", adminUsername, id);
        return toDto(saved);
    }

    public long getUnreviewedCount() {
        return feedbackRepository.countByIsReviewedFalse();
    }

    public Double getAverageRating() {
        return feedbackRepository.getAverageRating();
    }

    public List<FeedbackDto> getFeedbackByUser(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return List.of();
        }
        return feedbackRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private FeedbackDto toDto(Feedback feedback) {
        return FeedbackDto.builder()
                .id(feedback.getId())
                .userId(feedback.getUser() != null ? feedback.getUser().getId() : null)
                .userName(feedback.getUser() != null ? feedback.getUser().getFullName() : null)
                .userEmail(feedback.getUser() != null ? feedback.getUser().getEmail() : null)
                .name(feedback.getName())
                .email(feedback.getEmail())
                .message(feedback.getMessage())
                .rating(feedback.getRating())
                .category(feedback.getCategory())
                .isReviewed(feedback.getIsReviewed())
                .adminNotes(feedback.getAdminNotes())
                .adminResponse(feedback.getAdminResponse())
                .respondedByName(feedback.getRespondedBy() != null ? feedback.getRespondedBy().getFullName() : null)
                .createdAt(feedback.getCreatedAt())
                .reviewedAt(feedback.getReviewedAt())
                .respondedAt(feedback.getRespondedAt())
                .build();
    }
}
