package com.duonghd.app.dto.response;

import com.duonghd.app.contant.MovieType;

import java.math.BigDecimal;

public record MovieResponseDto(
        Long id,
        String title,
        String originalTitle,
        MovieType type,
        BigDecimal ratingScore,
        String thumbnailUrl,
        String schedule
) {
}
