package com.Deep.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @Email
    private String email;

    @NotBlank
    private String phone;

    private String address;

    @NotBlank
    private String designation;

    @Positive
    private Double salary;

    private LocalDate joiningDate;

    private Long departmentId;
}
