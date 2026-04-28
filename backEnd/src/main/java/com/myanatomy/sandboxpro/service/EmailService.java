package com.myanatomy.sandboxpro.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendOtpEmail(String toEmail, String otp, String purpose) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(getSubject(purpose));
            helper.setText(getEmailContent(otp, purpose, toEmail), true);

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String getSubject(String purpose) {
        return switch (purpose.toLowerCase()) {
            case "verification" -> "MentorBridge - Email Verification";
            case "password_reset" -> "MentorBridge - Password Reset";
            default -> "MentorBridge - Verification Code";
        };
    }

    private String getEmailContent(String otp, String purpose, String email) {
        String action = purpose.toLowerCase().equals("verification") ? "verify your email" : "reset your password";
        String title = purpose.toLowerCase().equals("verification") ? "Email Verification" : "Password Reset";
        
        String htmlContent = "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
            "</head>" +
            "<body style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 100%); margin: 0; padding: 20px;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; background-color: #1a1f2e; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3);\">" +
                    
                    "<div style=\"text-align: center; margin-bottom: 40px;\">" +
                        "<h1 style=\"background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; font-size: 32px; font-weight: 900;\">MentorBridge</h1>" +
                        "<p style=\"color: #9baad6; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 0.5px;\">Professional Mentorship Network</p>" +
                    "</div>" +
                    
                    "<h2 style=\"color: #dee5ff; margin-bottom: 20px; font-size: 24px; text-align: center;\">" + title + "</h2>" +
                    
                    "<p style=\"color: #9baad6; font-size: 16px; line-height: 1.8; margin-bottom: 30px; text-align: center;\">" +
                        "Hi there! Use the verification code below to " + action + " for your MentorBridge account." +
                    "</p>" +
                    
                    "<div style=\"background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border: 2px solid #6366f1; border-radius: 12px; padding: 40px; text-align: center; margin: 40px 0;\">" +
                        "<p style=\"color: #9baad6; font-size: 13px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;\">Your Verification Code</p>" +
                        "<div style=\"font-size: 48px; font-weight: 900; color: #6366f1; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 20px 0;\">" + otp + "</div>" +
                        "<p style=\"color: #9baad6; font-size: 13px; margin: 15px 0 0 0;\">This code expires in 5 minutes</p>" +
                    "</div>" +
                    
                    "<div style=\"background-color: rgba(168, 85, 247, 0.1); border-left: 4px solid #a855f7; border-radius: 8px; padding: 20px; margin: 30px 0;\">" +
                        "<p style=\"color: #d8b4fe; font-size: 14px; margin: 0; line-height: 1.6;\">" +
                            "<strong>🔒 Security Notice:</strong> Never share this code with anyone. MentorBridge will never ask for your verification code via phone or email." +
                        "</p>" +
                    "</div>" +
                    
                    "<p style=\"color: #9baad6; font-size: 14px; margin-top: 30px; line-height: 1.6;\">" +
                        "If you didn't request this verification code, please ignore this email or contact our support team immediately." +
                    "</p>" +
                    
                    "<div style=\"text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(99, 102, 241, 0.2);\">" +
                        "<p style=\"color: #6b7280; font-size: 12px; margin: 0; line-height: 1.6;\">" +
                            "© 2024 MentorBridge. All rights reserved.<br>" +
                            "Professional Mentorship Network" +
                        "</p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";
        
        return htmlContent;
    }
}