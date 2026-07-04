package com.Deep.controller;

import com.Deep.dto.request.LeaveRequestDTO;
import com.Deep.dto.request.LeaveResponseDTO;
import com.Deep.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService;

    @PostMapping("/request")
    public ResponseEntity<LeaveResponseDTO> applyLeave(
            @RequestParam Long employeeId,
            @Valid @RequestBody LeaveRequestDTO request) {

        LeaveResponseDTO response =
                leaveService.applyLeave(employeeId, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveResponseDTO>> getMyLeaves(
            @RequestParam Long employeeId) {

        return ResponseEntity.ok(
                leaveService.getMyLeaves(employeeId));
    }

    @PutMapping("/admin/{leaveId}/approve")
    public ResponseEntity<LeaveResponseDTO> approveLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveService.approveLeave(leaveId));
    }

    // HR
    @PutMapping("/admin/{leaveId}/reject")
    public ResponseEntity<LeaveResponseDTO> rejectLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveService.rejectLeave(leaveId));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<LeaveResponseDTO>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }
}
