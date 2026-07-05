package com.Deep.service;

import com.Deep.dto.request.LoginRequest;
import com.Deep.dto.request.RegisterRequest;
import com.Deep.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void sendOtp(String phone);

    boolean verifyOtp(String phone, String otp);

    String forgotPassword(String email);

    void resetPasswordWithOtp(String email, String otp, String newPassword);
}
