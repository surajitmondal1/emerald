package com.Deep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.Deep.repository.UserRepository;
import com.Deep.model.User;
import com.Deep.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class HumanResourceApplication {

	public static void main(String[] args) {
		SpringApplication.run(HumanResourceApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@emerald.com")) {
				User admin = User.builder()
						.employeeId("EMP001")
						.fullName("System Admin")
						.email("admin@emerald.com")
						.password(passwordEncoder.encode("admin123"))
						.role(Role.ADMIN)
						.build();
				userRepository.save(admin);
				System.out.println("Default admin user created: admin@emerald.com / admin123");
			}
		};
	}
}
