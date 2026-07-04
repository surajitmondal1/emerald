package com.Deep.repository;

import com.Deep.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    Optional<User> findByEmployeeId(String employeeId);

    Optional<User> findByEmailOrEmployeeId(String email, String employeeId);
}
