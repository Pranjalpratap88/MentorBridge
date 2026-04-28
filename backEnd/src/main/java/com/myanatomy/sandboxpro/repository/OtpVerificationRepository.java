package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    
    Optional<OtpVerification> findByEmailAndOtpAndTypeAndUsedFalse(
        String email, String otp, OtpVerification.OtpType type);
    
    Optional<OtpVerification> findByEmailAndTypeAndUsedFalseOrderByCreatedAtDesc(
        String email, OtpVerification.OtpType type);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM OtpVerification o WHERE o.expiryTime < :now")
    void deleteExpiredOtps(LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("UPDATE OtpVerification o SET o.used = true WHERE o.email = :email AND o.type = :type")
    void markAllAsUsedByEmailAndType(String email, OtpVerification.OtpType type);
}