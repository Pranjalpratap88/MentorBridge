package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.ApiResponse;
import com.myanatomy.sandboxpro.dto.QueryDto;
import com.myanatomy.sandboxpro.dto.ResponseDto;
import com.myanatomy.sandboxpro.model.UserRole;
import com.myanatomy.sandboxpro.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queries")
public class QueryController {

    @Autowired
    private QueryService queryService;

    @PostMapping
    public ResponseEntity<ApiResponse<QueryDto>> createQuery(
            @RequestBody QueryDto queryDto,
            Authentication authentication) {
        try {
            QueryDto savedQuery = queryService.createQuery(queryDto, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Query created successfully", savedQuery));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QueryDto>>> getAllQueries() {
        List<QueryDto> queries = queryService.getAllQueries();
        return ResponseEntity.ok(ApiResponse.success("Queries fetched successfully", queries));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<QueryDto>>> getPopularQueries() {
        List<QueryDto> queries = queryService.getPopularQueries();
        return ResponseEntity.ok(ApiResponse.success("Popular queries fetched", queries));
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<ApiResponse<List<QueryDto>>> getQueriesByTag(@PathVariable String tag) {
        List<QueryDto> queries = queryService.getQueriesByTag(tag);
        return ResponseEntity.ok(ApiResponse.success("Queries by tag fetched", queries));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QueryDto>> getQueryById(@PathVariable Long id) {
        try {
            QueryDto query = queryService.getQueryById(id);
            return ResponseEntity.ok(ApiResponse.success("Query fetched successfully", query));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<QueryDto>>> getMyQueries(Authentication authentication) {
        List<QueryDto> queries = queryService.getMyQueries(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("My queries fetched successfully", queries));
    }

    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<QueryDto>>> getAssignedQueries(Authentication authentication) {
        List<QueryDto> queries = queryService.getAssignedQueries(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Assigned queries fetched", queries));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<QueryDto>>> getQueriesForRole(@PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<QueryDto> queries = queryService.getQueriesForRole(userRole);
            return ResponseEntity.ok(ApiResponse.success("Queries for role fetched", queries));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role: " + role));
        }
    }

    @GetMapping("/unresolved")
    public ResponseEntity<ApiResponse<List<QueryDto>>> getUnresolvedQueries() {
        List<QueryDto> queries = queryService.getUnresolvedQueries();
        return ResponseEntity.ok(ApiResponse.success("Unresolved queries fetched", queries));
    }

    @PutMapping("/{id}/upvote")
    public ResponseEntity<ApiResponse<QueryDto>> upvoteQuery(
            @PathVariable Long id, Authentication authentication) {
        try {
            QueryDto query = queryService.toggleUpvote(id, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Upvote toggled", query));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<ApiResponse<ResponseDto>> submitResponse(
            @PathVariable Long id,
            @RequestBody ResponseDto responseDto,
            Authentication authentication) {
        try {
            ResponseDto savedResponse = queryService.submitResponse(id, responseDto, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Response submitted successfully", savedResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/responses/{id}/best")
    public ResponseEntity<ApiResponse<Void>> markAsBestAnswer(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            queryService.markAsBestAnswer(id, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Marked as best answer successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/responses/{id}/rate")
    public ResponseEntity<ApiResponse<Void>> rateResponse(
            @PathVariable Long id,
            @RequestParam Integer rating) {
        try {
            queryService.rateResponse(id, rating);
            return ResponseEntity.ok(ApiResponse.success("Response rated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/satisfied")
    public ResponseEntity<ApiResponse<Void>> markSatisfied(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            queryService.markSatisfiedWithCommunityAnswer(id, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Marked as satisfied", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/resend/{expertId}")
    public ResponseEntity<ApiResponse<Void>> resendToExpert(
            @PathVariable Long id,
            @PathVariable Long expertId,
            Authentication authentication) {
        try {
            queryService.resendQueryToExpert(id, expertId, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Query resent to expert", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
