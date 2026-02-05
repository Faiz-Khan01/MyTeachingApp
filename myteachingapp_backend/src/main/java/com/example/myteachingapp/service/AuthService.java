package com.example.myteachingapp.service;

import com.example.myteachingapp.config.JwtTokenProvider;
import com.example.myteachingapp.dto.LoginRequest;
import com.example.myteachingapp.dto.SignupRequest;
import com.example.myteachingapp.entity.Role;
import com.example.myteachingapp.entity.User;
import com.example.myteachingapp.repository.RoleRepository;
import com.example.myteachingapp.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    private static final String GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

    /**
     * Standard Login: Validates credentials and generates a JWT.
     */
    public String login(LoginRequest request) {
        // Find user by Email (Primary) or Username (Fallback)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> userRepository.findByUsername(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Invalid email or password")));

        // Verify Password matches the BCrypt hash in DB
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate Token using Email as the unique Subject
        return tokenProvider.generateToken(user.getEmail());
    }

    /**
     * User Registration: Saves a new user and links the default ROLE_STUDENT.
     */
    @Transactional
    public void register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setName(request.getName() != null ? request.getName() : request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Explicitly fetch and assign the role to populate user_roles table
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new RuntimeException("Error: ROLE_STUDENT not found in database."));

        Set<Role> roles = new HashSet<>();
        roles.add(studentRole);
        user.setRoles(roles);

        userRepository.save(user);
    }

    /**
     * Google Login: Validates Google ID Token and syncs user to local DB.
     */
    public String loginWithGoogle(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(email);
                newUser.setName((String) payload.get("name"));
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

                Role studentRole = roleRepository.findByName("ROLE_STUDENT").orElseThrow();
                newUser.setRoles(Collections.singleton(studentRole));
                return userRepository.save(newUser);
            });

            return tokenProvider.generateToken(user.getEmail());
        }
        throw new RuntimeException("Google Authentication Failed");
    }

    /**
     * Get Profile: Returns the current authenticated User entity.
     */
    public User getCurrentUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User session not found"));
    }
}