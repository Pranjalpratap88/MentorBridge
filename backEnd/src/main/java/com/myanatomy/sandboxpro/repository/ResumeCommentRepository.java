package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.ResumeComment;
import com.myanatomy.sandboxpro.model.ResumeReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeCommentRepository extends JpaRepository<ResumeComment, Long> {
    List<ResumeComment> findByReviewOrderByCreatedAtAsc(ResumeReviewEntity review);
}
