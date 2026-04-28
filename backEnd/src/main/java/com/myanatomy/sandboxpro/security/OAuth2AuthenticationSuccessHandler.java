package com.myanatomy.sandboxpro.security;

import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.frontend-url:http://localhost:5174}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String provider = oauthToken.getAuthorizedClientRegistrationId(); // "google" or "github"

        String email = extractEmail(oAuth2User, provider);
        String name = extractName(oAuth2User, provider);
        String avatarUrl = extractAvatar(oAuth2User, provider);

        if (email == null || email.isBlank()) {
            // If no email from provider, redirect with error
            getRedirectStrategy().sendRedirect(request, response,
                    frontendUrl + "/login?error=no_email");
            return;
        }

        // Find existing user or create a new one
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update profile picture if not set
            if (user.getProfilePicture() == null && avatarUrl != null) {
                user.setProfilePicture(avatarUrl);
                userRepository.save(user);
            }
        } else {
            // Create new user from OAuth2 data
            Set<Role> roles = new HashSet<>();
            roles.add(Role.STUDENT);

            user = User.builder()
                    .username(email.split("@")[0] + "_" + provider)
                    .email(email)
                    .password(UUID.randomUUID().toString()) // random password, they won't use it
                    .fullName(name != null ? name : email.split("@")[0])
                    .oauthProvider(provider)
                    .profilePicture(avatarUrl)
                    .roles(roles)
                    .reputationPoints(0)
                    .build();

            userRepository.save(user);
        }

        // Generate JWT for this user
        String jwt = jwtTokenProvider.generateTokenForUsername(user.getUsername());

        // Redirect to frontend with the token in the URL
        String targetUrl = frontendUrl + "/oauth2/callback?token=" + jwt;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String extractEmail(OAuth2User oAuth2User, String provider) {
        if ("google".equals(provider)) {
            return oAuth2User.getAttribute("email");
        } else if ("github".equals(provider)) {
            // GitHub may not include email in the default attributes
            String email = oAuth2User.getAttribute("email");
            if (email == null) {
                // Fallback: construct from login
                String login = oAuth2User.getAttribute("login");
                if (login != null) {
                    return login + "@github.user";
                }
            }
            return email;
        }
        return oAuth2User.getAttribute("email");
    }

    private String extractName(OAuth2User oAuth2User, String provider) {
        if ("google".equals(provider)) {
            return oAuth2User.getAttribute("name");
        } else if ("github".equals(provider)) {
            String name = oAuth2User.getAttribute("name");
            return name != null ? name : oAuth2User.getAttribute("login");
        }
        return oAuth2User.getAttribute("name");
    }

    private String extractAvatar(OAuth2User oAuth2User, String provider) {
        if ("google".equals(provider)) {
            return oAuth2User.getAttribute("picture");
        } else if ("github".equals(provider)) {
            return oAuth2User.getAttribute("avatar_url");
        }
        return null;
    }
}
