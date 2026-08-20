package com.duonghd.app.service.impl;

import com.duonghd.app.contant.Role;
import com.duonghd.app.dto.request.user.UserChangePasswordRequest;
import com.duonghd.app.dto.request.user.UserCreateRequest;
import com.duonghd.app.dto.request.user.UserUpdateRequest;
import com.duonghd.app.dto.response.user.UserResponseDto;
import com.duonghd.app.model.User;
import com.duonghd.app.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements com.duonghd.app.service.UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng ID: " + id));
        return mapToResponse(user);
    }

    @Transactional
    @Override
    public UserResponseDto createUser(UserCreateRequest request) {
        List<User> existingUsers = userRepository.findByUsernameOrEmail(request.username(), request.email());
        if (!existingUsers.isEmpty()) {
            for (User user : existingUsers) {
                if (user.getUsername().equalsIgnoreCase(request.username())) {
                    throw new IllegalArgumentException("Username đã được sử dụng: " + request.username());
                }
                if (user.getEmail().equalsIgnoreCase(request.email())) {
                    throw new IllegalArgumentException("Email đã được sử dụng: " + request.email());
                }
            }
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .avatarUrl(request.avatarUrl())
                .isActive(true)
                .role(request.role() != null ? request.role() : Role.USER)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    @Override
    public UserResponseDto updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng ID: " + id));

        // Dirty Checking apply
        if (request.fullName() != null) user.setFullName(request.fullName());
        if (request.avatarUrl() != null) user.setAvatarUrl(request.avatarUrl());
        if (request.isActive() != null) user.setIsActive(request.isActive());
        if (request.role() != null) user.setRole(request.role());

        return mapToResponse(user);
    }

    @Transactional
    @Override
    public void changePassword(Long id, UserChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng ID: " + id));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }

    @Transactional
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy người dùng ID: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponseDto mapToResponse(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getIsActive(),
                user.getRole()
        );
    }
}
