package com.duonghd.app.dto.request;

import com.duonghd.app.contant.MovieType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MovieUpdateRequest(
        String title,
        String originalTitle,
        MovieType type,
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "10.0")
        BigDecimal ratingScore,
        @Size(max = 500)
        String thumbnailUrl,
        @Size(max = 255)
        String schedule,
        String description
) {
}
