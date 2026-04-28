package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Query;
import com.myanatomy.sandboxpro.model.Response;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findByQueryOrderByCreatedAtDesc(Query query);
    List<Response> findByMentorOrderByCreatedAtDesc(User mentor);
}
