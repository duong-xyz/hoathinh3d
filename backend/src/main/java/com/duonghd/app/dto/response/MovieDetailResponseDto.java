package com.duonghd.app.dto.response;

import com.duonghd.app.contant.MovieType;

import java.math.BigDecimal;
import java.util.List;

public record MovieDetailResponseDto(
        Long id,
        String title,
        String originalTitle,
        MovieType type,
        BigDecimal ratingScore,
        String thumbnailUrl,
        String schedule,
        String description,
        List<EpisodeSummaryDto> episodes
) {
}
