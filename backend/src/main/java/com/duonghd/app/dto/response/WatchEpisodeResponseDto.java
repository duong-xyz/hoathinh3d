package com.duonghd.app.dto.response;

import java.util.List;

public record WatchEpisodeResponseDto(
        Long movieId,
        String movieTitle,
        Long episodeId,
        Integer episodeNumber,
        String episodeTitle,
        List<EpisodeSourceDto> sources
) {
}
