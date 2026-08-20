package com.duonghd.app.dto.response;

public record UserSummaryDto(
    Long id,
    String username,
    String avatarUrl
) {
}
