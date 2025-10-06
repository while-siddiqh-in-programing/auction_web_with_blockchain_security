package com.example.demo.controllers;

import com.example.demo.model.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow all origins for development
public class UserController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public RegisterResponse registerUser(@RequestBody User user) {
        try {
            User createdUser = userService.registerUser(user);
            return new RegisterResponse(true, "Registration successful", createdUser);
        } catch (RuntimeException e) {
            return new RegisterResponse(false, e.getMessage(), null);
        }
    }

    // Login user
    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            return new LoginResponse(true, "Login successful", user);
        } else {
            return new LoginResponse(false, "Invalid credentials", null);
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    public User getUser(@PathVariable String id) {
        return userService.getUser(id);
    }

    // Login request DTO
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Login response DTO
    public static class LoginResponse {
        private boolean success;
        private String message;
        private User user;

        public LoginResponse(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }
    }

    // Registration response DTO
    public static class RegisterResponse {
        private boolean success;
        private String message;
        private User user;

        public RegisterResponse(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }
    }
}