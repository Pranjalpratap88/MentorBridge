package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.*;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.model.OtpVerification;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.model.UserRole;
import com.myanatomy.sandboxpro.repository.UserRepository;
import com.myanatomy.sandboxpro.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpService otpService;

    // ─────────────────────────────────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public String login(LoginDto loginDto) {
        // 1. Look up the user first so we can give precise messages
        User user = userRepository
                .findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new AppException("Invalid username or password", HttpStatus.UNAUTHORIZED));

        boolean emailVerified  = Boolean.TRUE.equals(user.getEmailVerified());
        boolean accountEnabled = Boolean.TRUE.equals(user.getAccountEnabled());
        boolean accountLocked  = Boolean.TRUE.equals(user.getAccountLocked());

        if (!emailVerified) {
            throw new AppException(
                "Please verify your email before logging in. Check your inbox for the verification code.",
                HttpStatus.FORBIDDEN);
        }
        if (!accountEnabled) {
            throw new AppException(
                "Your account is not active. Please complete email verification or contact support.",
                HttpStatus.FORBIDDEN);
        }
        if (accountLocked) {
            throw new AppException("Your account has been locked. Please contact support.", HttpStatus.FORBIDDEN);
        }

        // 2. Delegate password check to Spring Security
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsernameOrEmail(),
                            loginDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            log.info("User logged in: {}", user.getUsername());
            return jwtTokenProvider.generateToken(authentication);

        } catch (BadCredentialsException ex) {
            throw new AppException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        } catch (DisabledException ex) {
            throw new AppException(
                "Your account is not active. Please verify your email first.", HttpStatus.FORBIDDEN);
        } catch (LockedException ex) {
            throw new AppException("Your account has been locked. Please contact support.", HttpStatus.FORBIDDEN);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REGISTER
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public String register(RegisterDto registerDto) {
        // --- username uniqueness ---
        Optional<User> existingByUsername = userRepository.findByUsername(registerDto.getUsername());
        if (existingByUsername.isPresent()) {
            User existing = existingByUsername.get();
            if (Boolean.TRUE.equals(existing.getEmailVerified())) {
                throw new AppException("This username is already taken. Please choose a different one.");
            }
            // Unverified leftover — delete it so the user can re-register
            userRepository.delete(existing);
            userRepository.flush();   // force DELETE before the INSERT below
        }

        // --- email uniqueness ---
        Optional<User> existingByEmail = userRepository.findByEmail(registerDto.getEmail());
        if (existingByEmail.isPresent()) {
            User existing = existingByEmail.get();
            if (Boolean.TRUE.equals(existing.getEmailVerified())) {
                throw new AppException("This email address is already registered. Please log in instead.");
            }
            userRepository.delete(existing);
            userRepository.flush();
        }

        // --- role-specific field validation ---
        validateRoleSpecificFields(registerDto);

        // --- create the user (disabled until OTP confirmed) ---
        User user = User.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .fullName(registerDto.getFullName())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .userRole(registerDto.getUserRole())
                .college(registerDto.getCollege())
                .graduationYear(registerDto.getGraduationYear())
                .degree(registerDto.getDegree())
                .branch(registerDto.getBranch())
                .currentCompany(registerDto.getCurrentCompany())
                .currentPosition(registerDto.getCurrentPosition())
                .workExperience(registerDto.getWorkExperience())
                .industry(registerDto.getIndustry())
                .linkedinProfile(registerDto.getLinkedinProfile())
                .achievements(registerDto.getAchievements())
                .bio(registerDto.getBio())
                .roles(Set.of(mapUserRoleToSystemRole(registerDto.getUserRole())))
                .emailVerified(false)
                .accountEnabled(false)   // activated only after OTP
                .accountLocked(false)
                .build();

        userRepository.save(user);

        // --- send OTP ---
        otpService.generateAndSendOtp(user.getEmail(), OtpVerification.OtpType.EMAIL_VERIFICATION);

        log.info("User registered (pending OTP): {}", user.getUsername());
        return "Registration successful! A 6-digit verification code has been sent to " + user.getEmail();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EMAIL VERIFICATION
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void sendEmailVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("No account found with this email address."));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new AppException("This email is already verified. You can log in.");
        }

        otpService.generateAndSendOtp(email, OtpVerification.OtpType.EMAIL_VERIFICATION);
        log.info("Verification OTP sent to: {}", email);
    }

    @Override
    @Transactional
    public boolean verifyEmail(OtpVerificationDto otpDto) {
        boolean valid = otpService.verifyOtp(
                otpDto.getEmail(), otpDto.getOtp(), OtpVerification.OtpType.EMAIL_VERIFICATION);

        if (!valid) {
            return false;
        }

        User user = userRepository.findByEmail(otpDto.getEmail())
                .orElseThrow(() -> new AppException("No account found with this email address."));

        user.setEmailVerified(true);
        user.setAccountEnabled(true);
        userRepository.save(user);

        log.info("Email verified and account activated: {}", otpDto.getEmail());
        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PASSWORD RESET
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void sendPasswordResetOtp(ForgotPasswordDto forgotPasswordDto) {
        // Don't reveal whether the email exists — always respond the same way
        userRepository.findByEmail(forgotPasswordDto.getEmail())
                .orElseThrow(() -> new AppException(
                    "If an account with that email exists, a reset code has been sent."));

        otpService.generateAndSendOtp(forgotPasswordDto.getEmail(), OtpVerification.OtpType.PASSWORD_RESET);
        log.info("Password reset OTP sent to: {}", forgotPasswordDto.getEmail());
    }

    @Override
    @Transactional
    public boolean resetPassword(ResetPasswordDto resetPasswordDto) {
        boolean valid = otpService.verifyOtp(
                resetPasswordDto.getEmail(), resetPasswordDto.getOtp(),
                OtpVerification.OtpType.PASSWORD_RESET);

        if (!valid) {
            return false;
        }

        User user = userRepository.findByEmail(resetPasswordDto.getEmail())
                .orElseThrow(() -> new AppException("No account found with this email address."));

        user.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));
        userRepository.save(user);

        log.info("Password reset for: {}", resetPasswordDto.getEmail());
        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RESEND OTP
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void resendOtp(String email, String type) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("No account found with this email address."));

        OtpVerification.OtpType otpType = "verification".equalsIgnoreCase(type)
                ? OtpVerification.OtpType.EMAIL_VERIFICATION
                : OtpVerification.OtpType.PASSWORD_RESET;

        otpService.generateAndSendOtp(email, otpType);
        log.info("OTP resent to {} for type {}", email, type);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private void validateRoleSpecificFields(RegisterDto dto) {
        UserRole role = dto.getUserRole();
        int currentYear = Year.now().getValue();

        switch (role) {
            case STUDENT -> {
                requireField(dto.getCollege(), "College name is required for students");
                requireField(dto.getGraduationYear(), "Graduation year is required for students");
                int gradYear = parseYear(dto.getGraduationYear());
                if (gradYear <= currentYear)
                    throw new AppException("Students must have a future graduation year (after " + currentYear + ")");
                if (gradYear > currentYear + 6)
                    throw new AppException("Graduation year is too far in the future");
            }
            case SENIOR_STUDENT -> {
                requireField(dto.getCollege(), "College name is required");
                requireField(dto.getGraduationYear(), "Graduation year is required");
                int gradYear = parseYear(dto.getGraduationYear());
                if (gradYear != currentYear && gradYear != currentYear + 1)
                    throw new AppException(
                        "Senior students must be graduating in " + currentYear + " or " + (currentYear + 1));
            }
            case ALUMNI -> {
                requireField(dto.getCollege(), "College name is required for alumni");
                requireField(dto.getGraduationYear(), "Graduation year is required for alumni");
                requireField(dto.getCurrentCompany(), "Current company is required for alumni");
                requireField(dto.getCurrentPosition(), "Current position is required for alumni");
                int gradYear = parseYear(dto.getGraduationYear());
                if (gradYear >= currentYear)
                    throw new AppException("Alumni must have already graduated (graduation year must be before " + currentYear + ")");
                if (gradYear < currentYear - 50)
                    throw new AppException("Graduation year seems too far in the past");
            }
            case MENTOR -> {
                requireField(dto.getCurrentCompany(), "Current company is required for mentors");
                requireField(dto.getCurrentPosition(), "Current position is required for mentors");
                requireField(dto.getWorkExperience(), "Work experience is required for mentors");
                int exp = parseExperience(dto.getWorkExperience());
                if (exp < 2)
                    throw new AppException("Mentors must have at least 2 years of work experience");
            }
        }
    }

    private void requireField(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new AppException(message);
        }
    }

    private int parseYear(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            throw new AppException("Graduation year must be a valid 4-digit number");
        }
    }

    private int parseExperience(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            throw new AppException("Work experience must be a valid number (e.g. 3)");
        }
    }

    private Role mapUserRoleToSystemRole(UserRole userRole) {
        return switch (userRole) {
            case STUDENT, SENIOR_STUDENT -> Role.STUDENT;
            case ALUMNI -> Role.ALUMNI;
            case MENTOR -> Role.MENTOR;
            case ADMIN -> Role.ADMIN;
        };
    }
}
