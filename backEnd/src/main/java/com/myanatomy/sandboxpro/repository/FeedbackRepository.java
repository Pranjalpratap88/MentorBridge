package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Feedback;
import com.myanatomy.sandboxpro.model.Feedback.FeedbackCategory;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByOrderByCreatedAtDesc();
    List<Feedback> findByIsReviewedFalseOrderByCreatedAtDesc();
    List<Feedback> findByIsReviewedTrueOrderByCreatedAtDesc();
    List<Feedback> findByCategoryOrderByCreatedAtDesc(FeedbackCategory category);
    List<Feedback> findByRatingOrderByCreatedAtDesc(Integer rating);
    long countByIsReviewedFalse();
    long countByRating(Integer rating);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
    
    List<Feedback> findByUserOrderByCreatedAtDesc(User user);
}
