package com.example.mini_erp.service;

import org.springframework.stereotype.Service;

import com.example.mini_erp.model.User;
import com.example.mini_erp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
private final UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + username));
    }
}
