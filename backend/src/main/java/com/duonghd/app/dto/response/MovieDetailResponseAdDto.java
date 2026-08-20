package com.duonghd.app.dto.response;

import com.duonghd.app.contant.MovieType;

import java.math.BigDecimal;
import java.util.List;

public record MovieDetailResponseAdDto(
        Long id,
        String title,
        String originalTitle,
        MovieType type,
        BigDecimal ratingScore,
        String thumbnailUrl,
        String schedule,
        List<EpisodeResponseDto> episodes
) {
}
