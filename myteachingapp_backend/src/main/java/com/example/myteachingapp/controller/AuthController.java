package com.example.myteachingapp.controller;

import com.example.myteachingapp.dto.LoginRequest;
import com.example.myteachingapp.dto.SignupRequest;
import com.example.myteachingapp.service.AuthService;
import com.example.myteachingapp.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        authService.register(signupRequest);
        return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body)
            throws GeneralSecurityException, IOException {
        String idToken = body.get("token");
        String jwt = authService.loginWithGoogle(idToken);
        return ResponseEntity.ok(Collections.singletonMap("token", jwt));
    }

    // UPDATED: This returns a clean JSON object for your React AuthContext
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        User user = authService.getCurrentUserProfile();

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("username", user.getUsername());
        profile.put("roles", user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList()));

        return ResponseEntity.ok(profile);
    }
}