package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Check if user already exists by username
        User existingUserByUsername = userRepository.findByUsername(user.getUsername());
        if (existingUserByUsername != null) {
            throw new RuntimeException("User with username " + user.getUsername() + " already exists");
        }
        
        // Check if user already exists by email
        User existingUserByEmail = userRepository.findByEmail(user.getEmail());
        if (existingUserByEmail != null) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists");
        }

        // Hash password (in production, use BCrypt)
        user.setPassword(hashPassword(user.getPassword()));
        
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        // Try to find user by username first, then by email
        User user = userRepository.findByUsername(username);
        if (user == null) {
            user = userRepository.findByEmail(username); // Allow login with email too
        }
        
        if (user != null && verifyPassword(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public User getUser(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Simple password hashing (use BCrypt in production)
    private String hashPassword(String password) {
        return Integer.toString(password.hashCode());
    }

    private boolean verifyPassword(String plainPassword, String hashedPassword) {
        return hashPassword(plainPassword).equals(hashedPassword);
    }
}