package com.Deep.model;

import com.Deep.enums.SalaryStatus;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "payroll")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String month;

    private Integer year;

    private Double basicSalary;

    private Double allowance;

    private Double deduction;

    private Double netSalary;

    @Enumerated(EnumType.STRING)
    private SalaryStatus status;
}
