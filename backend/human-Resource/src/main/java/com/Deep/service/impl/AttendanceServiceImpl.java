package com.Deep.service.impl;


import com.Deep.dto.request.AttendanceRequest;
import com.Deep.dto.request.AttendanceRespons;
import com.Deep.enums.AttendanceAction;
import com.Deep.enums.AttendanceStatus;
import com.Deep.exception.ResourceNotFoundException;
import com.Deep.model.Attendance;
import com.Deep.model.Employee;
import com.Deep.repository.AttendanceRepository;
import com.Deep.repository.EmployeeRepository;
import com.Deep.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public AttendanceRespons clockAttendance(Long employeeId,
                                             AttendanceRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByEmployeeAndAttendanceDate(employee, today)
                .orElse(null);

        if (request.getAction() == AttendanceAction.IN) {

            if (attendance != null) {
                throw new RuntimeException("Already Checked In");
            }

            attendance = Attendance.builder()
                    .employee(employee)
                    .attendanceDate(today)
                    .checkInTime(LocalDateTime.now())
                    .status(AttendanceStatus.PRESENT)
                    .build();

        } else {

            if (attendance == null) {
                throw new RuntimeException("Please Check-In First");
            }

            attendance.setCheckOutTime(LocalDateTime.now());
        }

        attendanceRepository.save(attendance);

        return map(attendance);
    }

    @Override
    public List<AttendanceRespons> getMyAttendance(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return attendanceRepository.findByEmployee(employee)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<AttendanceRespons> getAttendanceByDate(LocalDate date) {

        return attendanceRepository.findByAttendanceDate(date)
                .stream()
                .map(this::map)
                .toList();
    }

    private AttendanceRespons map(Attendance attendance) {

        return AttendanceRespons.builder()
                .id(attendance.getId())
                .employeeName(attendance.getEmployee().getFullName())
                .attendanceDate(attendance.getAttendanceDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus())
                .build();
    }
}

