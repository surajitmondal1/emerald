package com.Deep.controller;

import com.Deep.dto.request.PayrollRequest;
import com.Deep.dto.request.PayrollResponse;
import com.Deep.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class PayrollController {
    private final PayrollService payrollService;

    // HR/Admin - Generate Payroll
    @PostMapping("/api/admin/payroll/generate")
    public ResponseEntity<List<PayrollResponse>> generatePayroll(
            @Valid @RequestBody PayrollRequest request) {

        List<PayrollResponse> response =
                payrollService.generatePayroll(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Employee - View My Payslips
    @GetMapping("/api/payroll/my-payslips")
    public ResponseEntity<List<PayrollResponse>> getMyPayslips(
            @RequestParam Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getMyPayslips(employeeId));
    }
}
