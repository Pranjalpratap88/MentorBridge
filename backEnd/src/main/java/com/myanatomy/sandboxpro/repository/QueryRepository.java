package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Query;
import com.myanatomy.sandboxpro.model.QueryStatus;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueryRepository extends JpaRepository<Query, Long> {
    List<Query> findByStudentOrderByCreatedAtDesc(User student);
    List<Query> findByStatusOrderByCreatedAtDesc(QueryStatus status);
    List<Query> findByTagsContainingOrderByCreatedAtDesc(String tag);
    List<Query> findByAssignedToOrderByCreatedAtDesc(User assignedTo);
    List<Query> findByTargetRoleOrderByCreatedAtDesc(UserRole targetRole);
    List<Query> findByIsPopularTrueOrderByPopularCountDesc();
    List<Query> findByAssignedToIsNullOrderByCreatedAtDesc();
    long countByTagsContaining(String tag);
}
