package com.Deep.service.impl;

import com.Deep.dto.request.PayrollRequest;
import com.Deep.dto.request.PayrollResponse;
import com.Deep.enums.SalaryStatus;
import com.Deep.exception.ResourceNotFoundException;
import com.Deep.model.Employee;
import com.Deep.model.Payroll;
import com.Deep.repository.EmployeeRepository;
import com.Deep.repository.PayrollRepository;
import com.Deep.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public List<PayrollResponse> generatePayroll(PayrollRequest request) {

        List<Employee> employees = employeeRepository.findAll();
        List<PayrollResponse> responses = new ArrayList<>();

        for (Employee employee : employees) {

            double basic = employee.getSalary();
            double allowance = basic * 0.10;   // 10%
            double deduction = basic * 0.05;   // 5%
            double netSalary = basic + allowance - deduction;

            Payroll payroll = Payroll.builder()
                    .employee(employee)
                    .month(request.getMonth())
                    .year(request.getYear())
                    .basicSalary(basic)
                    .allowance(allowance)
                    .deduction(deduction)
                    .netSalary(netSalary)
                    .status(SalaryStatus.PAID)
                    .build();

            payrollRepository.save(payroll);

            responses.add(map(payroll));
        }

        return responses;
    }

    @Override
    public List<PayrollResponse> getMyPayslips(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return payrollRepository.findByEmployee(employee)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<PayrollResponse> getAllPayroll(String month, Integer year) {
        return payrollRepository.findByMonthAndYear(month, year)
                .stream()
                .map(this::map)
                .toList();
    }

    private PayrollResponse map(Payroll payroll) {

        return PayrollResponse.builder()
                .id(payroll.getId())
                .employeeId(payroll.getEmployee().getEmployeeId())
                .employeeName(payroll.getEmployee().getFullName())
                .month(payroll.getMonth())
                .year(payroll.getYear())
                .basicSalary(payroll.getBasicSalary())
                .allowance(payroll.getAllowance())
                .deduction(payroll.getDeduction())
                .netSalary(payroll.getNetSalary())
                .status(payroll.getStatus())
                .build();
    }
}
