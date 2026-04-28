package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.*;
import com.myanatomy.sandboxpro.exception.AppException;
import com.myanatomy.sandboxpro.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginDto loginDto) {
        String token = authService.login(loginDto);
        JwtAuthResponse body = new JwtAuthResponse();
        body.setAccessToken(token);
        return ResponseEntity.ok(ApiResponse.success("Login successful", body));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterDto registerDto) {
        String message = authService.register(registerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(message, null));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@Valid @RequestBody OtpVerificationDto otpDto) {
        boolean verified = authService.verifyEmail(otpDto);
        if (!verified) {
            throw new AppException("Invalid or expired verification code. Please request a new one.");
        }
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully! You can now log in.", null));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<String>> resendVerification(@RequestParam String email) {
        authService.sendEmailVerification(email);
        return ResponseEntity.ok(ApiResponse.success("A new verification code has been sent to your email.", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {
        authService.sendPasswordResetOtp(forgotPasswordDto);
        return ResponseEntity.ok(ApiResponse.success(
            "If an account with that email exists, a reset code has been sent.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        boolean reset = authService.resetPassword(resetPasswordDto);
        if (!reset) {
            throw new AppException("Invalid or expired reset code. Please request a new one.");
        }
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully! You can now log in.", null));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(
            @RequestParam String email,
            @RequestParam String type) {
        authService.resendOtp(email, type);
        return ResponseEntity.ok(ApiResponse.success("A new code has been sent to your email.", null));
    }
}
