package com.duonghd.app.service;

import com.duonghd.app.dto.request.user.UserChangePasswordRequest;
import com.duonghd.app.dto.request.user.UserCreateRequest;
import com.duonghd.app.dto.request.user.UserUpdateRequest;
import com.duonghd.app.dto.response.user.UserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {
    Page<UserResponseDto> getAllUsers(Pageable pageable);

    UserResponseDto getUserById(Long id);

    @Transactional
    UserResponseDto createUser(UserCreateRequest request);

    @Transactional
    UserResponseDto updateUser(Long id, UserUpdateRequest request);

    @Transactional
    void changePassword(Long id, UserChangePasswordRequest request);

    @Transactional
    void deleteUser(Long id);
}
