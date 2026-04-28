package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.*;

public interface AuthService {
    String login(LoginDto loginDto);
    String register(RegisterDto registerDto);
    void sendEmailVerification(String email);
    boolean verifyEmail(OtpVerificationDto otpDto);
    void sendPasswordResetOtp(ForgotPasswordDto forgotPasswordDto);
    boolean resetPassword(ResetPasswordDto resetPasswordDto);
    void resendOtp(String email, String type);
}