package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.QueryDto;
import com.myanatomy.sandboxpro.dto.ResponseDto;
import com.myanatomy.sandboxpro.model.UserRole;

import java.util.List;

public interface QueryService {
    QueryDto createQuery(QueryDto queryDto, String username);
    List<QueryDto> getAllQueries();
    List<QueryDto> getPopularQueries();
    List<QueryDto> getQueriesByTag(String tag);
    QueryDto getQueryById(Long id);
    List<QueryDto> getMyQueries(String username);
    List<QueryDto> getAssignedQueries(String username);
    List<QueryDto> getQueriesForRole(UserRole role);
    List<QueryDto> getUnresolvedQueries();

    ResponseDto submitResponse(Long queryId, ResponseDto responseDto, String mentorUsername);
    void markAsBestAnswer(Long responseId, String studentUsername);
    void rateResponse(Long responseId, Integer rating);
    void markSatisfiedWithCommunityAnswer(Long queryId, String studentUsername);
    void resendQueryToExpert(Long queryId, Long expertId, String studentUsername);
}
