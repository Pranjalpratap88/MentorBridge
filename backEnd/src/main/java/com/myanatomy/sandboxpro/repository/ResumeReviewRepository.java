package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Resume;
import com.myanatomy.sandboxpro.model.ResumeReviewEntity;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeReviewRepository extends JpaRepository<ResumeReviewEntity, Long> {
    List<ResumeReviewEntity> findByResumeOrderByCreatedAtDesc(Resume resume);
    List<ResumeReviewEntity> findByReviewerOrderByCreatedAtDesc(User reviewer);
    Optional<ResumeReviewEntity> findByResumeAndReviewer(Resume resume, User reviewer);
    long countByResume(Resume resume);
}
