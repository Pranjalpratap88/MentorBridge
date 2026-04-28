package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpType type; // EMAIL_VERIFICATION, PASSWORD_RESET

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Builder.Default
    private Boolean used = false;

    @Builder.Default
    private Integer attempts = 0;

    public enum OtpType {
        EMAIL_VERIFICATION,
        PASSWORD_RESET
    }
}