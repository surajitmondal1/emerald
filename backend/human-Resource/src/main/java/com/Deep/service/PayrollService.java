package com.Deep.service;

import com.Deep.dto.request.PayrollRequest;
import com.Deep.dto.request.PayrollResponse;

import java.util.List;

public interface PayrollService {

    List<PayrollResponse> generatePayroll(PayrollRequest request);

    List<PayrollResponse> getMyPayslips(Long employeeId);
}
