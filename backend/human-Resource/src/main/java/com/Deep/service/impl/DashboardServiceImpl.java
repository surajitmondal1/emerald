package com.Deep.service.impl;

import com.Deep.dto.request.DashboardResponse;
import com.Deep.enums.LeaveStatus;
import com.Deep.repository.AttendanceRepository;
import com.Deep.repository.EmployeeRepository;
import com.Deep.repository.LeaveRepository;
import com.Deep.repository.PayrollRepository;
import com.Deep.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;

    @Override
    public DashboardResponse getDashboard() {

        long totalEmployees = employeeRepository.count();

        long presentToday =
                attendanceRepository.countByAttendanceDate(LocalDate.now());

        long employeesOnLeave =
                leaveRepository.countByStatus(LeaveStatus.APPROVED);

        long payrollGenerated =
                payrollRepository.count();

        return DashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .presentToday(presentToday)
                .employeesOnLeave(employeesOnLeave)
                .payrollGenerated(payrollGenerated)
                .build();
    }
}
