package com.example.myteachingapp.config;

import com.example.myteachingapp.entity.Role;
import com.example.myteachingapp.entity.User;
import com.example.myteachingapp.repository.RoleRepository;
import com.example.myteachingapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Initialize Roles
        initializeRole("ROLE_STUDENT");
        initializeRole("ROLE_ADMIN");

        // 2. Create a Default Admin User (if it doesn't exist)
        if (!userRepository.existsByEmail("admin@teachingapp.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setUsername("admin");
            admin.setEmail("admin@teachingapp.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Change this later!

            Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
            admin.setRoles(Collections.singleton(adminRole));

            userRepository.save(admin);
            System.out.println("✅ Default Admin created: admin@teachingapp.com / admin123");
        }
    }

    private void initializeRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            System.out.println("✅ Role created: " + roleName);
        }
    }
}