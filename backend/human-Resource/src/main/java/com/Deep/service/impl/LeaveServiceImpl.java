package com.Deep.service.impl;

import com.Deep.dto.request.LeaveRequestDTO;
import com.Deep.dto.request.LeaveResponseDTO;
import com.Deep.enums.LeaveStatus;
import com.Deep.exception.ResourceNotFoundException;
import com.Deep.model.Employee;
import com.Deep.model.LeaveRequest;
import com.Deep.repository.EmployeeRepository;
import com.Deep.repository.LeaveRepository;
import com.Deep.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public LeaveResponseDTO applyLeave(Long employeeId,
                                       LeaveRequestDTO request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        LeaveRequest leave = LeaveRequest.builder()
                .employee(employee)
                .type(request.getType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        leaveRepository.save(leave);

        return map(leave);
    }

    @Override
    public List<LeaveResponseDTO> getMyLeaves(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return leaveRepository.findByEmployee(employee)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public LeaveResponseDTO approveLeave(Long leaveId) {

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave not found"));

        leave.setStatus(LeaveStatus.APPROVED);

        leaveRepository.save(leave);

        return map(leave);
    }

    @Override
    public LeaveResponseDTO rejectLeave(Long leaveId) {

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave not found"));

        leave.setStatus(LeaveStatus.REJECTED);

        leaveRepository.save(leave);

        return map(leave);
    }

    private LeaveResponseDTO map(LeaveRequest leave){

        return LeaveResponseDTO.builder()
                .id(leave.getId())
                .employeeName(leave.getEmployee().getFullName())
                .type(leave.getType())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .build();
    }

}
