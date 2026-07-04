package com.Deep.service;

import com.Deep.dto.request.LoginRequest;
import com.Deep.dto.request.RegisterRequest;
import com.Deep.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
