package com.duonghd.app.repository;

import com.duonghd.app.contant.Role;
import com.duonghd.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByRole(Role role);

    boolean existsByEmail(String email);
    List<User> findByUsernameOrEmail(String username, String email);
}
