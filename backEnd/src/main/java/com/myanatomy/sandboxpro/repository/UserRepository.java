package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<User> findByOrderByReputationPointsDesc();
    List<User> findByUserRoleAndEmailVerifiedTrueOrderByReputationPointsDesc(UserRole userRole);
    List<User> findByUserRoleInAndEmailVerifiedTrueOrderByFullNameAsc(List<UserRole> roles);
    List<User> findByUserRoleAndIndustryContainingIgnoreCaseAndEmailVerifiedTrueOrderByFullNameAsc(UserRole userRole, String industry);
    List<User> findByUserRoleInAndIndustryContainingIgnoreCaseAndEmailVerifiedTrueOrderByFullNameAsc(List<UserRole> roles, String industry);
    long countByEmailVerifiedTrue();
    long countByUserRole(UserRole userRole);
}
