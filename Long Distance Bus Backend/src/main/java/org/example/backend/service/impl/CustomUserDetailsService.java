package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.repository.AdminRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .<UserDetails>map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPasswordHash())
                        .authorities("USER")
                        .build())

                .orElseGet(() -> adminRepository.findByEmail(email)
                        .map(admin -> org.springframework.security.core.userdetails.User
                                .withUsername(admin.getEmail())
                                .password(admin.getPassword())
                                .authorities("ADMIN")
                                .build())
                        .orElseThrow(() -> new UsernameNotFoundException("User/Admin not found with email: " + email))
                );
    }
}
