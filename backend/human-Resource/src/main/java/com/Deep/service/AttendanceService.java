package com.Deep.service;


import com.Deep.dto.request.AttendanceRequest;
import com.Deep.dto.request.AttendanceRespons;

import java.time.LocalDate;
import java.util.List;

public interface  AttendanceService {
    AttendanceRespons clockAttendance(Long employeeId,
                                      AttendanceRequest request);

    List<AttendanceRespons> getMyAttendance(Long employeeId);

    List<AttendanceRespons> getAttendanceByDate(LocalDate date);
}
