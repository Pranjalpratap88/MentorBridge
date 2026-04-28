package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.QueryDto;
import com.myanatomy.sandboxpro.dto.ResponseDto;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.Query;
import com.myanatomy.sandboxpro.model.QueryStatus;
import com.myanatomy.sandboxpro.model.Response;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.model.UserRole;
import com.myanatomy.sandboxpro.repository.QueryRepository;
import com.myanatomy.sandboxpro.repository.ResponseRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueryServiceImpl implements QueryService {

    private static final int POPULAR_THRESHOLD = 10;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public QueryDto createQuery(QueryDto queryDto, String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if a similar query already exists (same tags) to increment popular count
        Query.QueryBuilder builder = Query.builder()
                .title(queryDto.getTitle())
                .content(queryDto.getContent())
                .tags(queryDto.getTags())
                .student(student)
                .status(QueryStatus.OPEN)
                .targetRole(queryDto.getTargetRole())
                .targetRoles(queryDto.getTargetRoles() != null ? String.join(",", queryDto.getTargetRoles()) : null)
                .popularCount(1)
                .isPopular(false)
                .isPrivate(Boolean.TRUE.equals(queryDto.getIsPrivate()))
                .satisfiedWithCommunityAnswer(false);

        // If a specific user is assigned
        if (queryDto.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(queryDto.getAssignedToId())
                    .orElseThrow(() -> new AppException("Assigned user not found"));
            builder.assignedTo(assignedTo);
        }

        Query query = builder.build();

        // Check if similar queries exist (same tags) to determine popularity
        // Only for public queries
        if (!Boolean.TRUE.equals(query.getIsPrivate()) && queryDto.getTags() != null && !queryDto.getTags().isBlank()) {
            String[] tagArray = queryDto.getTags().split(",");
            for (String tag : tagArray) {
                long count = queryRepository.countByTagsContaining(tag.trim());
                if (count >= POPULAR_THRESHOLD - 1) {
                    query.setIsPopular(true);
                    query.setPopularCount((int) count + 1);
                    break;
                }
            }
        }

        Query savedQuery = queryRepository.save(query);

        // Fire notification for private query or specific assignment
        if (savedQuery.getAssignedTo() != null) {
            notificationService.createPrivateQueryNotification(
                    savedQuery.getAssignedTo(), student,
                    savedQuery.getId(), savedQuery.getTitle());
        }

        return mapToQueryDto(savedQuery);
    }

    @Override
    public List<QueryDto> getAllQueries() {
        // Public feed: exclude private queries
        return queryRepository.findAll().stream()
                .filter(q -> !Boolean.TRUE.equals(q.getIsPrivate()))
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QueryDto> getPopularQueries() {
        return queryRepository.findByIsPopularTrueOrderByPopularCountDesc().stream()
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QueryDto> getQueriesByTag(String tag) {
        return queryRepository.findByTagsContainingOrderByCreatedAtDesc(tag).stream()
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    public QueryDto getQueryById(Long id) {
        Query query = queryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
        return mapToQueryDto(query);
    }

    @Override
    public List<QueryDto> getMyQueries(String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return queryRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QueryDto> getAssignedQueries(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return queryRepository.findByAssignedToOrderByCreatedAtDesc(user).stream()
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QueryDto> getQueriesForRole(UserRole role) {
        return queryRepository.findByTargetRoleOrderByCreatedAtDesc(role).stream()
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QueryDto> getUnresolvedQueries() {
        return queryRepository.findByStatusOrderByCreatedAtDesc(QueryStatus.OPEN).stream()
                .filter(q -> !Boolean.TRUE.equals(q.getIsPrivate()))
                .map(this::mapToQueryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResponseDto submitResponse(Long queryId, ResponseDto responseDto, String mentorUsername) {
        Query query = queryRepository.findById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        User mentor = userRepository.findByUsername(mentorUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Response response = Response.builder()
                .content(responseDto.getContent())
                .query(query)
                .mentor(mentor)
                .isCommunityResponse(responseDto.getIsCommunityResponse() != null
                        ? responseDto.getIsCommunityResponse() : false)
                .build();

        Response savedResponse = responseRepository.save(response);

        // Reward responder for answering
        mentor.setReputationPoints(mentor.getReputationPoints() + 5);
        userRepository.save(mentor);

        // Notify the query author that they got a response
        if (!query.getStudent().getId().equals(mentor.getId())) {
            notificationService.createResponseNotification(
                    query.getStudent(), mentor, query.getId(), query.getTitle());
        }

        return mapToResponseDto(savedResponse);
    }

    @Override
    @Transactional
    public void markAsBestAnswer(Long responseId, String studentUsername) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getQuery().getStudent().getUsername().equals(studentUsername)) {
            throw new AppException("Only the student who asked the query can mark the best answer");
        }

        response.setIsBestAnswer(true);
        response.getQuery().setStatus(QueryStatus.RESOLVED);

        // Reward mentor for best answer
        User mentor = response.getMentor();
        mentor.setReputationPoints(mentor.getReputationPoints() + 50);

        responseRepository.save(response);
        queryRepository.save(response.getQuery());
        userRepository.save(mentor);

        // Notify the responder their answer was marked best
        User student = response.getQuery().getStudent();
        notificationService.createBestAnswerNotification(
                mentor, student, response.getQuery().getId(), response.getQuery().getTitle());
    }

    @Override
    @Transactional
    public void rateResponse(Long responseId, Integer rating) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));
        response.setRating(rating);
        responseRepository.save(response);
    }

    @Override
    @Transactional
    public void markSatisfiedWithCommunityAnswer(Long queryId, String studentUsername) {
        Query query = queryRepository.findById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        if (!query.getStudent().getUsername().equals(studentUsername)) {
            throw new AppException("Only the query author can mark satisfaction");
        }

        query.setSatisfiedWithCommunityAnswer(true);
        query.setStatus(QueryStatus.RESOLVED);
        queryRepository.save(query);
    }

    @Override
    @Transactional
    public void resendQueryToExpert(Long queryId, Long expertId, String studentUsername) {
        Query query = queryRepository.findById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        if (!query.getStudent().getUsername().equals(studentUsername)) {
            throw new AppException("Only the query author can reassign the query");
        }

        User expert = userRepository.findById(expertId)
                .orElseThrow(() -> new RuntimeException("Expert not found"));

        query.setAssignedTo(expert);
        query.setSatisfiedWithCommunityAnswer(false);
        query.setStatus(QueryStatus.OPEN);
        queryRepository.save(query);

        // Notify the expert
        User student = query.getStudent();
        notificationService.createQueryAssignedNotification(
                expert, student, query.getId(), query.getTitle());
    }

    private QueryDto mapToQueryDto(Query query) {
        int responseCount = query.getResponses() != null ? query.getResponses().size() : 0;
        return QueryDto.builder()
                .id(query.getId())
                .title(query.getTitle())
                .content(query.getContent())
                .tags(query.getTags())
                .status(query.getStatus())
                .studentId(query.getStudent().getId())
                .studentName(query.getStudent().getFullName())
                .studentProfilePicture(query.getStudent().getProfilePicture())
                .assignedToId(query.getAssignedTo() != null ? query.getAssignedTo().getId() : null)
                .assignedToName(query.getAssignedTo() != null ? query.getAssignedTo().getFullName() : null)
                .targetRole(query.getTargetRole())
                .targetRoles(query.getTargetRoles())
                .popularCount(query.getPopularCount())
                .isPopular(query.getIsPopular())
                .satisfiedWithCommunityAnswer(query.getSatisfiedWithCommunityAnswer())
                .isPrivate(query.getIsPrivate())
                .createdAt(query.getCreatedAt())
                .responseCount(responseCount)
                .responses(query.getResponses() != null ?
                        query.getResponses().stream().map(this::mapToResponseDto).collect(Collectors.toList()) : null)
                .build();
    }

    private ResponseDto mapToResponseDto(Response response) {
        User mentor = response.getMentor();
        String mentorRole = mentor.getUserRole() != null ? mentor.getUserRole().name() : null;
        String mentorCompany = mentor.getCurrentCompany();

        return ResponseDto.builder()
                .id(response.getId())
                .content(response.getContent())
                .queryId(response.getQuery().getId())
                .mentorId(mentor.getId())
                .mentorName(mentor.getFullName())
                .mentorProfilePicture(mentor.getProfilePicture())
                .mentorRole(mentorRole)
                .mentorCompany(mentorCompany)
                .isBestAnswer(response.getIsBestAnswer())
                .rating(response.getRating())
                .isCommunityResponse(response.getIsCommunityResponse())
                .createdAt(response.getCreatedAt())
                .build();
    }
}
