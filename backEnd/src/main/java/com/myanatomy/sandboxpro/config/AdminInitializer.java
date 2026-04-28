package com.myanatomy.sandboxpro.config;

import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.model.UserRole;
import com.myanatomy.sandboxpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            // Create fresh admin
            User admin = User.builder()
                    .username("admin")
                    .email("admin@mentorbridge.com")
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("Admin@123"))
                    .userRole(UserRole.ADMIN)
                    .roles(Set.of(Role.ADMIN))
                    .emailVerified(true)
                    .accountEnabled(true)
                    .accountLocked(false)
                    .bio("System Administrator")
                    .reputationPoints(0)
                    .build();
            userRepository.save(admin);
            log.info("==============================================");
            log.info("Admin user created successfully!");
            log.info("Username: admin");
            log.info("Password: Admin@123");
            log.info("Email: admin@mentorbridge.com");
            log.info("==============================================");
        } else {
            // Fix any existing admin that was created with wrong role/points
            userRepository.findByUsername("admin").ifPresent(admin -> {
                boolean dirty = false;
                if (admin.getUserRole() != UserRole.ADMIN) {
                    admin.setUserRole(UserRole.ADMIN);
                    dirty = true;
                }
                if (admin.getReputationPoints() != null && admin.getReputationPoints() != 0) {
                    admin.setReputationPoints(0);
                    dirty = true;
                }
                if (!admin.getRoles().contains(Role.ADMIN)) {
                    admin.setRoles(Set.of(Role.ADMIN));
                    dirty = true;
                }
                if (dirty) {
                    userRepository.save(admin);
                    log.info("Admin user corrected: userRole=ADMIN, reputationPoints=0");
                } else {
                    log.info("Admin user already correct. Skipping.");
                }
            });
        }
    }
}
