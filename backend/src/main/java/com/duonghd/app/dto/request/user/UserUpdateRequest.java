package com.duonghd.app.dto.request.user;

import com.duonghd.app.contant.Role;

public record UserUpdateRequest(
        String fullName,
        String avatarUrl,
        Boolean isActive,
        Role role
) {
}
