package com.Deep.dto.request;

import lombok.Data;
import java.time.LocalDate;
import com.Deep.enums.Role;

@Data
public class EmployeeRequest {

    private String employeeId;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private String designation;

    private Double salary;

    private LocalDate joiningDate;

    private Long departmentId;

    private String departmentName;

    private Role role;
}
