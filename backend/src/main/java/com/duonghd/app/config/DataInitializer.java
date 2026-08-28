package com.duonghd.app.config;

import com.duonghd.app.contant.Role;
import com.duonghd.app.model.User;
import com.duonghd.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if(!userRepository.existsByRole(Role.ADMIN)) {
            log.info("Creating admin user...");
            User admin = User.builder()
                    .username("admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("111111"))
                    .isActive(true)
                    .role(Role.ADMIN).build();
            userRepository.save(admin);
            log.info("Admin user created: Username:admin | Password: 111111");
        } else {
            log.info("Admin user already exists: Username:admin | Password: 111111");
        }
    }
}
