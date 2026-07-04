package com.Deep.service.impl;

import com.Deep.dto.request.EmployeeRequest;
import com.Deep.dto.request.EmployeeResponse;
import com.Deep.model.Department;
import com.Deep.model.Employee;
import com.Deep.model.User;
import com.Deep.enums.Role;
import com.Deep.repository.DepartmentRepository;
import com.Deep.repository.EmployeeRepository;
import com.Deep.repository.UserRepository;
import com.Deep.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public EmployeeResponse addEmployee(EmployeeRequest request) {

        if(employeeRepository.existsByEmployeeId(request.getEmployeeId())){
            throw new RuntimeException("Employee ID already exists");
        }

        if(employeeRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        if (department == null && request.getDepartmentName() != null && !request.getDepartmentName().trim().isEmpty()) {
            String name = request.getDepartmentName().trim();
            department = departmentRepository.findByDepartmentName(name)
                .orElseGet(() -> {
                    Department newDept = Department.builder()
                        .departmentName(name)
                        .departmentCode(name.substring(0, Math.min(3, name.length())).toUpperCase())
                        .build();
                    return departmentRepository.save(newDept);
                });
        }
        if (department == null) {
            department = departmentRepository.findByDepartmentName("General")
                .orElseGet(() -> {
                    Department general = Department.builder()
                        .departmentName("General")
                        .departmentCode("GEN")
                        .build();
                    return departmentRepository.save(general);
                });
        }

        Employee employee = Employee.builder()
                .employeeId(request.getEmployeeId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .designation(request.getDesignation())
                .salary(request.getSalary())
                .joiningDate(request.getJoiningDate())
                .department(department)
                .build();

        employeeRepository.save(employee);

        // Auto register User login
        String generatedPassword = "Emp" + (int)(Math.random() * 900000 + 100000) + "!";
        User user = User.builder()
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .password(passwordEncoder.encode(generatedPassword))
                .role(request.getRole() != null ? request.getRole() : Role.EMPLOYEE)
                .build();
        userRepository.save(user);

        EmployeeResponse response = mapToResponse(employee);
        response.setPassword(generatedPassword);
        response.setRole(user.getRole().name());
        return response;
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return mapToResponse(employee);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            employee.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            employee.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            employee.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress());
        }
        if (request.getDesignation() != null && !request.getDesignation().trim().isEmpty()) {
            employee.setDesignation(request.getDesignation());
        }
        if (request.getSalary() != null) {
            employee.setSalary(request.getSalary());
        }
        if (request.getJoiningDate() != null) {
            employee.setJoiningDate(request.getJoiningDate());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        if (department == null && request.getDepartmentName() != null && !request.getDepartmentName().trim().isEmpty()) {
            String name = request.getDepartmentName().trim();
            department = departmentRepository.findByDepartmentName(name)
                .orElseGet(() -> {
                    Department newDept = Department.builder()
                        .departmentName(name)
                        .departmentCode(name.substring(0, Math.min(3, name.length())).toUpperCase())
                        .build();
                    return departmentRepository.save(newDept);
                });
        }
        if (department != null) {
            employee.setDepartment(department);
        }

        userRepository.findByEmployeeId(employee.getEmployeeId()).ifPresent(user -> {
            user.setFullName(employee.getFullName());
            user.setEmail(employee.getEmail());
            if (request.getRole() != null) {
                user.setRole(request.getRole());
            }
            userRepository.save(user);
        });

        employeeRepository.save(employee);

        return mapToResponse(employee);
    }

    @Override
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employeeRepository.delete(employee);
    }

    private EmployeeResponse mapToResponse(Employee employee){
        String roleStr = userRepository.findByEmployeeId(employee.getEmployeeId())
                .map(u -> u.getRole().name())
                .orElse("EMPLOYEE");

        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .designation(employee.getDesignation())
                .salary(employee.getSalary())
                .joiningDate(employee.getJoiningDate())
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : "General")
                .role(roleStr)
                .build();
    }
}
