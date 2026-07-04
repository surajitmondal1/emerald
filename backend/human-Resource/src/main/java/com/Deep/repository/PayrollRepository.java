package com.Deep.repository;

import com.Deep.model.Employee;
import com.Deep.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll,Long> {
    List<Payroll> findByEmployee(Employee employee);
    List<Payroll> findByMonthAndYear(String month, Integer year);
    long count();
}
