package com.Deep.repository;

import com.Deep.model.Attendance;
import com.Deep.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee,
                                                         LocalDate attendanceDate);

    List<Attendance> findByEmployee(Employee employee);

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    long countByAttendanceDate(LocalDate attendanceDate);
}
