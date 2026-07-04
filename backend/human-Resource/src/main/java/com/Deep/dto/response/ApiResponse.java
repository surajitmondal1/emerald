package com.Deep.dto.response;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private Object data;
}
