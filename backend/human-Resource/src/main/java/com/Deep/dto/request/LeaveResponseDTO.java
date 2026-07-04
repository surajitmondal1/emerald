package com.Deep.dto.request;

import com.Deep.enums.LeaveStatus;
import com.Deep.enums.LeaveType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;


@Data
@Builder
public class LeaveResponseDTO {
    private Long id;

    private String employeeName;

    private LeaveType type;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private LeaveStatus status;

}
