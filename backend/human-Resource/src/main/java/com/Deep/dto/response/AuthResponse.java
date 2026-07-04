package com.Deep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AuthResponse {

    private String token;

    private String message;

    private Long id;

    private String employeeId;

    private String fullName;

    private String email;

    private String role;
}
