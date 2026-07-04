package com.Deep.service;

import com.Deep.dto.request.LeaveRequestDTO;
import com.Deep.dto.request.LeaveResponseDTO;

import java.util.List;

public interface LeaveService {
    LeaveResponseDTO applyLeave(Long employeeId, LeaveRequestDTO request);

    List<LeaveResponseDTO> getMyLeaves(Long employeeId);

    LeaveResponseDTO approveLeave(Long leaveId);

    LeaveResponseDTO rejectLeave(Long leaveId);

    List<LeaveResponseDTO> getAllLeaves();
}
