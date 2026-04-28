package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.model.OtpVerification;
import com.myanatomy.sandboxpro.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.otp.expiration:300000}") // 5 minutes default
    private long otpExpirationMs;

    private static final int OTP_LENGTH = 6;
    private static final int MAX_ATTEMPTS = 3;

    @Transactional
    public void generateAndSendOtp(String email, OtpVerification.OtpType type) {
        // Mark all previous OTPs as used
        otpRepository.markAllAsUsedByEmailAndType(email, type);

        // Generate new OTP
        String otp = generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusSeconds(otpExpirationMs / 1000);

        // Save OTP
        OtpVerification otpVerification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .type(type)
                .expiryTime(expiryTime)
                .build();

        otpRepository.save(otpVerification);

        // Send email
        String purpose = type == OtpVerification.OtpType.EMAIL_VERIFICATION ? "verification" : "password_reset";
        emailService.sendOtpEmail(email, otp, purpose);

        log.info("OTP generated and sent for email: {} with type: {}", email, type);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp, OtpVerification.OtpType type) {
        Optional<OtpVerification> otpVerificationOpt = otpRepository
                .findByEmailAndOtpAndTypeAndUsedFalse(email, otp, type);

        if (otpVerificationOpt.isEmpty()) {
            log.warn("Invalid OTP attempt for email: {} with type: {}", email, type);
            return false;
        }

        OtpVerification otpVerification = otpVerificationOpt.get();

        // Check if expired
        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            log.warn("Expired OTP attempt for email: {} with type: {}", email, type);
            return false;
        }

        // Check attempts
        if (otpVerification.getAttempts() >= MAX_ATTEMPTS) {
            log.warn("Max attempts exceeded for OTP verification for email: {} with type: {}", email, type);
            return false;
        }

        // Mark as used
        otpVerification.setUsed(true);
        otpRepository.save(otpVerification);

        log.info("OTP verified successfully for email: {} with type: {}", email, type);
        return true;
    }

    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }

    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        log.debug("Cleaned up expired OTPs");
    }
}