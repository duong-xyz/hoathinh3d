package com.duonghd.app.dto.response;

import com.duonghd.app.contant.SourceType;

public record EpisodeSourceDto(
        Long id,
        String serverName,
        SourceType sourceType,
        String sourceURL,
        String quality
) {
}
