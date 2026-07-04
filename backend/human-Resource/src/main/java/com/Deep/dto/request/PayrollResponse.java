package com.Deep.dto.request;

import com.Deep.enums.SalaryStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PayrollResponse {

    private Long id;

    private String employeeName;

    private String employeeId;

    private String month;

    private Integer year;

    private Double basicSalary;

    private Double allowance;

    private Double deduction;

    private Double netSalary;

    private SalaryStatus status;
}
