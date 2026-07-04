package com.Deep.security;

import com.Deep.model.User;
import com.Deep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmailOrEmployeeId(email, email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User Not Found"));

        String username = (user.getEmail() != null && !user.getEmail().isEmpty()) ? user.getEmail() : user.getEmployeeId();

        return new org.springframework.security.core.userdetails.User(
                username,
                user.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                )
        );
    }
}
