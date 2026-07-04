package com.Deep.dto.request;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeResponse {
    private Long id;

    private String employeeId;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private String designation;

    private Double salary;

    private LocalDate joiningDate;

    private String departmentName;

    private String password;

    private String role;
}
