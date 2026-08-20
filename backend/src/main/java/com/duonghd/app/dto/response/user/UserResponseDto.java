package com.duonghd.app.dto.response.user;

import com.duonghd.app.contant.Role;

public record UserResponseDto(
        Long id,
        String username,
        String email,
        String fullName,
        String avatarUrl,
        Boolean isActive,
        Role role
) {
}
