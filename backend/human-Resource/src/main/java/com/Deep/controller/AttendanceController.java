package com.Deep.controller;

import com.Deep.dto.request.AttendanceRequest;
import com.Deep.dto.request.AttendanceRespons;
import com.Deep.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;


    @PostMapping("/clock")
    public ResponseEntity<AttendanceRespons> clockAttendance(
            @RequestParam Long employeeId,
            @Valid @RequestBody AttendanceRequest request) {

        AttendanceRespons response =
                attendanceService.clockAttendance(employeeId, request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my-attendance")
    public ResponseEntity<List<AttendanceRespons>> getMyAttendance(
            @RequestParam Long employeeId) {

        return ResponseEntity.ok(
                attendanceService.getMyAttendance(employeeId));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<AttendanceRespons>> getAttendanceByDate(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByDate(date));
    }
}
