package com.example.mini_erp.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mini_erp.repository.UserRepository;
import com.example.mini_erp.security.JwtUtil;
import java.util.Map;
import java.util.Optional;
import com.example.mini_erp.model.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

     @PostMapping("/register")
public Map<String, String> register(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");
    String fullName = body.get("fullName");
    String role = body.getOrDefault("role", "ROLE_USER"); // récupère le rôle ou USER par défaut

    if (userRepo.existsByUsername(username)) {
        return Map.of("error", "Username already exists");
    }

    // On vérifie que le rôle est soit ROLE_USER soit ROLE_ADMIN
    if (!role.equals("ROLE_USER") && !role.equals("ROLE_ADMIN")) {
        role = "ROLE_USER"; // rôle par défaut si invalide
    }

    User user = User.builder()
            .username(username)
            .password(passwordEncoder.encode(password))
            .fullName(fullName)
            .role(role)
            .build();

    userRepo.save(user);
    return Map.of("message", "User registered successfully with role: " + role);
}


 @PostMapping("/login")
public Map<String, String> login(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");

    Optional<User> userOpt = userRepo.findByUsername(username);
    if (userOpt.isEmpty()) {
        return Map.of("error", "Invalid credentials");
    }

    User user = userOpt.get();

    if (!passwordEncoder.matches(password, user.getPassword())) {
        return Map.of("error", "Invalid credentials");
    }

    // ← CORRECTION ICI : on passe l'objet User complet, pas juste le username
    String token = jwtUtil.generateToken(user);

    return Map.of("token", token);
}

}
