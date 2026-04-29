package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Resume;
import com.myanatomy.sandboxpro.model.Resume.ResumeStatus;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByOwnerAndStatusNotOrderByUploadedAtDesc(User owner, ResumeStatus status);
    List<Resume> findByOwnerAndStatusOrderByUploadedAtDesc(User owner, ResumeStatus status);

    // Find resumes open for review that are visible to a given role
    @Query("SELECT r FROM Resume r WHERE r.reviewRequestOpen = true AND r.status = 'ACTIVE' AND r.visibleToRoles LIKE %:role%")
    List<Resume> findOpenForReviewByRole(@Param("role") String role);

    // Find all resumes open for review (for seniors/alumni/mentors to browse)
    @Query("SELECT r FROM Resume r WHERE r.reviewRequestOpen = true AND r.status = 'ACTIVE' ORDER BY r.uploadedAt DESC")
    List<Resume> findAllOpenForReview();
}
