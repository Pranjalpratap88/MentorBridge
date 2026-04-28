package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.UserDto;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.model.UserRole;
import com.myanatomy.sandboxpro.repository.QueryRepository;
import com.myanatomy.sandboxpro.repository.ResponseRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Override
    public UserDto getProfile(String usernameOrEmail) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    @Override
    public UserDto updateProfile(String usernameOrEmail, UserDto userDto) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDto.getFullName() != null) user.setFullName(userDto.getFullName());
        if (userDto.getCollege() != null) user.setCollege(userDto.getCollege());
        if (userDto.getCurrentCompany() != null) user.setCurrentCompany(userDto.getCurrentCompany());
        if (userDto.getCurrentPosition() != null) user.setCurrentPosition(userDto.getCurrentPosition());
        if (userDto.getGraduationYear() != null) user.setGraduationYear(userDto.getGraduationYear());
        if (userDto.getDegree() != null) user.setDegree(userDto.getDegree());
        if (userDto.getBranch() != null) user.setBranch(userDto.getBranch());
        if (userDto.getWorkExperience() != null) user.setWorkExperience(userDto.getWorkExperience());
        if (userDto.getIndustry() != null) user.setIndustry(userDto.getIndustry());
        if (userDto.getLinkedinProfile() != null) user.setLinkedinProfile(userDto.getLinkedinProfile());
        if (userDto.getAchievements() != null) user.setAchievements(userDto.getAchievements());
        if (userDto.getBio() != null) user.setBio(userDto.getBio());
        if (userDto.getProfilePicture() != null) user.setProfilePicture(userDto.getProfilePicture());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    public List<UserDto> getLeaderboard() {
        return userRepository.findByOrderByReputationPointsDesc().stream()
                .filter(u -> Boolean.TRUE.equals(u.getEmailVerified()))
                .filter(u -> u.getUserRole() != UserRole.ADMIN) // Exclude admins
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getUsersByRole(UserRole role) {
        return userRepository.findByUserRoleAndEmailVerifiedTrueOrderByReputationPointsDesc(role)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getNetworkUsers(String usernameOrEmail) {
        User currentUser = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        List<UserRole> networkRoles = Arrays.asList(
                UserRole.SENIOR_STUDENT, UserRole.ALUMNI, UserRole.MENTOR
        );

        return userRepository.findByUserRoleInAndEmailVerifiedTrueOrderByFullNameAsc(networkRoles)
                .stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> searchExperts(String currentUsername, String role, String industry, String college) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        List<UserRole> targetRoles;
        if (role != null && !role.isBlank()) {
            try {
                targetRoles = List.of(UserRole.valueOf(role.toUpperCase()));
            } catch (IllegalArgumentException e) {
                targetRoles = Arrays.asList(UserRole.SENIOR_STUDENT, UserRole.ALUMNI, UserRole.MENTOR);
            }
        } else {
            targetRoles = Arrays.asList(UserRole.SENIOR_STUDENT, UserRole.ALUMNI, UserRole.MENTOR);
        }

        List<User> users;
        if (industry != null && !industry.isBlank()) {
            users = userRepository.findByUserRoleInAndIndustryContainingIgnoreCaseAndEmailVerifiedTrueOrderByFullNameAsc(
                    targetRoles, industry);
        } else {
            users = userRepository.findByUserRoleInAndEmailVerifiedTrueOrderByFullNameAsc(targetRoles);
        }

        return users.stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .filter(u -> college == null || college.isBlank() ||
                        (u.getCollege() != null && u.getCollege().toLowerCase().contains(college.toLowerCase())))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("reputationPoints", user.getReputationPoints());
        stats.put("queriesAsked", queryRepository.findByStudentOrderByCreatedAtDesc(user).size());
        stats.put("responsesGiven", responseRepository.findByMentorOrderByCreatedAtDesc(user).size());
        stats.put("totalUsers", userRepository.countByEmailVerifiedTrue());
        stats.put("userRole", user.getUserRole());
        stats.put("fullName", user.getFullName());
        stats.put("college", user.getCollege());
        stats.put("currentCompany", user.getCurrentCompany());
        stats.put("currentPosition", user.getCurrentPosition());

        // Role-specific stats
        if (user.getUserRole() == UserRole.MENTOR || user.getUserRole() == UserRole.ALUMNI) {
            long assignedQueries = queryRepository.findByAssignedToOrderByCreatedAtDesc(user).size();
            stats.put("assignedQueries", assignedQueries);
        }

        return stats;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getUserRole() != UserRole.ADMIN)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto toggleUserLock(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        if (user.getUserRole() == UserRole.ADMIN) {
            throw new AppException("Cannot modify admin accounts", HttpStatus.FORBIDDEN);
        }
        user.setAccountLocked(!Boolean.TRUE.equals(user.getAccountLocked()));
        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserDto toggleUserEnable(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        if (user.getUserRole() == UserRole.ADMIN) {
            throw new AppException("Cannot modify admin accounts", HttpStatus.FORBIDDEN);
        }
        user.setAccountEnabled(!Boolean.TRUE.equals(user.getAccountEnabled()));
        return mapToDto(userRepository.save(user));
    }

    @Override
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.countByEmailVerifiedTrue());
        stats.put("totalStudents", userRepository.countByUserRole(UserRole.STUDENT));
        stats.put("totalSeniors", userRepository.countByUserRole(UserRole.SENIOR_STUDENT));
        stats.put("totalAlumni", userRepository.countByUserRole(UserRole.ALUMNI));
        stats.put("totalMentors", userRepository.countByUserRole(UserRole.MENTOR));
        stats.put("totalQueries", queryRepository.count());
        stats.put("openQueries", queryRepository.findByStatusOrderByCreatedAtDesc(com.myanatomy.sandboxpro.model.QueryStatus.OPEN).size());
        stats.put("resolvedQueries", queryRepository.findByStatusOrderByCreatedAtDesc(com.myanatomy.sandboxpro.model.QueryStatus.RESOLVED).size());
        return stats;
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userRole(user.getUserRole())
                .college(user.getCollege())
                .graduationYear(user.getGraduationYear())
                .degree(user.getDegree())
                .branch(user.getBranch())
                .currentCompany(user.getCurrentCompany())
                .currentPosition(user.getCurrentPosition())
                .workExperience(user.getWorkExperience())
                .industry(user.getIndustry())
                .linkedinProfile(user.getLinkedinProfile())
                .achievements(user.getAchievements())
                .roles(user.getRoles())
                .reputationPoints(user.getReputationPoints())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .oauthProvider(user.getOauthProvider())
                .emailVerified(user.getEmailVerified())
                .accountEnabled(user.getAccountEnabled())
                .accountLocked(user.getAccountLocked())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
