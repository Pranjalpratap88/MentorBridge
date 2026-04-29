package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.ApiResponse;
import com.myanatomy.sandboxpro.dto.UserDto;
import com.myanatomy.sandboxpro.model.UserRole;
import com.myanatomy.sandboxpro.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        try {
            UserDto userDto = userService.getProfile(authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @RequestBody UserDto userDto,
            Authentication authentication) {
        try {
            UserDto updatedUser = userService.updateProfile(authentication.getName(), userDto);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<List<UserDto>>> getLeaderboard() {
        List<UserDto> leaderboard = userService.getLeaderboard();
        return ResponseEntity.ok(ApiResponse.success("Leaderboard fetched successfully", leaderboard));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByRole(@PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<UserDto> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(ApiResponse.success("Users fetched by role", users));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role: " + role));
        }
    }

    @GetMapping("/network")
    public ResponseEntity<ApiResponse<List<UserDto>>> getNetworkUsers(Authentication authentication) {
        try {
            List<UserDto> users = userService.getNetworkUsers(authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Network users fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Search experts for private query targeting.
     * Params: role (SENIOR_STUDENT|ALUMNI|MENTOR), industry (optional), college (optional)
     */
    @GetMapping("/experts")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchExperts(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String college,
            Authentication authentication) {
        try {
            List<UserDto> users = userService.searchExperts(
                    authentication.getName(), role, industry, college);
            return ResponseEntity.ok(ApiResponse.success("Experts fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Search users to send a query to, with rich filters.
     * roles: comma-separated list (SENIOR_STUDENT,ALUMNI,MENTOR)
     * college, company, industry: partial match filters
     * minReputation: minimum reputation points
     * limit: max results (capped at 15)
     */
    @GetMapping("/query-targets")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchQueryTargets(
            @RequestParam(required = false) String roles,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) Integer minReputation,
            @RequestParam(defaultValue = "15") int limit,
            Authentication authentication) {
        try {
            List<String> roleList = (roles != null && !roles.isBlank())
                    ? Arrays.asList(roles.split(","))
                    : null;
            List<UserDto> users = userService.searchUsersForQuery(
                    authentication.getName(), roleList, college, company, industry, minReputation, limit);
            return ResponseEntity.ok(ApiResponse.success("Query targets fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(Authentication authentication) {
        try {
            Map<String, Object> stats = userService.getDashboardStats(authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Admin-only user management ────────────────────────────────────────────

    @GetMapping("/admin/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        try {
            List<UserDto> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("All users fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/toggle-lock")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserLock(@PathVariable Long id) {
        try {
            UserDto user = userService.toggleUserLock(id);
            return ResponseEntity.ok(ApiResponse.success("User lock status updated", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/toggle-enable")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserEnable(@PathVariable Long id) {
        try {
            UserDto user = userService.toggleUserEnable(id);
            return ResponseEntity.ok(ApiResponse.success("User enable status updated", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/stats")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        try {
            Map<String, Object> stats = userService.getAdminStats();
            return ResponseEntity.ok(ApiResponse.success("Admin stats fetched", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
// need to implement chat feature 