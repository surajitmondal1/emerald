package com.Deep.repository;

import com.Deep.enums.LeaveStatus;
import com.Deep.model.Employee;
import com.Deep.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest,Long> {
    List<LeaveRequest> findByEmployee(Employee employee);
    long countByStatus(LeaveStatus status);
}
