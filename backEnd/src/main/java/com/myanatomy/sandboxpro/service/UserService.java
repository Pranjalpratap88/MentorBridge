package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.UserDto;
import com.myanatomy.sandboxpro.model.UserRole;

import java.util.List;
import java.util.Map;

public interface UserService {
    UserDto getProfile(String usernameOrEmail);
    UserDto updateProfile(String usernameOrEmail, UserDto userDto);
    List<UserDto> getLeaderboard();
    List<UserDto> getUsersByRole(UserRole role);
    List<UserDto> getNetworkUsers(String usernameOrEmail);
    List<UserDto> searchExperts(String currentUsername, String role, String industry, String college);
    Map<String, Object> getDashboardStats(String username);
    List<UserDto> getAllUsers();
    UserDto toggleUserLock(Long userId);
    UserDto toggleUserEnable(Long userId);
    Map<String, Object> getAdminStats();
}
