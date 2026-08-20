package com.duonghd.app.dto.response;

import java.util.List;

public record EpisodeResponseDto(
        Long id,
        Integer episodeNumber,
        String title,
        List<EpisodeSourceDto> sources
) {
}
