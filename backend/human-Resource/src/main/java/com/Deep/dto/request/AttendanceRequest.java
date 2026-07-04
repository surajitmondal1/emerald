package com.Deep.dto.request;

import com.Deep.enums.AttendanceAction;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRequest {

    @NotNull(message = "Action is required")
    private AttendanceAction action;
}
