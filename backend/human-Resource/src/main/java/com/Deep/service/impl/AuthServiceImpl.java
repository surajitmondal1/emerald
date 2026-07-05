package com.Deep.service.impl;

import com.Deep.dto.request.LoginRequest;
import com.Deep.dto.request.RegisterRequest;
import com.Deep.dto.response.AuthResponse;
import com.Deep.model.User;
import com.Deep.model.Employee;
import com.Deep.repository.UserRepository;
import com.Deep.repository.EmployeeRepository;
import com.Deep.security.JwtService;
import com.Deep.service.AuthService;
import com.Deep.service.SmsService;
import com.Deep.model.OtpVerification;
import com.Deep.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpVerificationRepository otpVerificationRepository;
    private final SmsService smsService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists.");
        }

        User user = User.builder()
                .employeeId(request.getEmployeeId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        userRepository.save(user);

        Employee employee = Employee.builder()
                .employeeId(request.getEmployeeId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .joiningDate(java.time.LocalDate.now())
                .build();
        employeeRepository.save(employee);

        return AuthResponse.builder()
                .message("User Registered Successfully")
                .token(null)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmailOrEmployeeId(request.getEmail(), request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        String tokenSubject = (user.getEmail() != null && !user.getEmail().isEmpty()) ? user.getEmail() : user.getEmployeeId();
        String token = jwtService.generateToken(tokenSubject);

        Employee employee = employeeRepository.findByEmail(user.getEmail()).orElse(null);
        Long id = (employee != null) ? employee.getId() : user.getId();

        return AuthResponse.builder()
                .message("Login Successful")
                .token(token)
                .id(id)
                .employeeId(user.getEmployeeId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public void sendOtp(String phone) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        OtpVerification otpVerification = OtpVerification.builder()
                .phone(phone)
                .otp(otp)
                .expiryTime(expiry)
                .verified(false)
                .build();

        otpVerificationRepository.save(otpVerification);

        smsService.sendSms(phone, "Your Emerald verification OTP is: " + otp + ". Valid for 5 minutes.");
    }

    @Override
    public boolean verifyOtp(String phone, String otp) {
        Optional<OtpVerification> optOtp = otpVerificationRepository.findTopByPhoneAndVerifiedFalseOrderByExpiryTimeDesc(phone);
        if (optOtp.isEmpty()) {
            throw new RuntimeException("OTP not sent or already verified.");
        }
        OtpVerification otpVerification = optOtp.get();
        if (LocalDateTime.now().isAfter(otpVerification.getExpiryTime())) {
            throw new RuntimeException("OTP expired.");
        }
        if (!otpVerification.getOtp().equals(otp)) {
            throw new RuntimeException("Incorrect OTP.");
        }
        otpVerification.setVerified(true);
        otpVerificationRepository.save(otpVerification);
        return true;
    }

    @Override
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        String phone = user.getPhone();
        if (phone == null || phone.trim().isEmpty()) {
            throw new RuntimeException("No registered phone number found for this account.");
        }

        sendOtp(phone);

        if (phone.length() <= 4) {
            return "****";
        }
        return "****" + phone.substring(phone.length() - 4);
    }

    @Override
    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String phone = user.getPhone();
        if (phone == null || phone.trim().isEmpty()) {
            throw new RuntimeException("No registered phone number found for this account.");
        }

        verifyOtp(phone, otp);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}