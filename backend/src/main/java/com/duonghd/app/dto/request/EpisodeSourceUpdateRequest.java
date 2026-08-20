package com.duonghd.app.dto.request;

import com.duonghd.app.contant.SourceType;
import jakarta.validation.constraints.Size;

public record EpisodeSourceUpdateRequest(
        @Size(max = 40)
        String serverName,
        SourceType sourceType,
        String sourceURL,
        String quality
) {
}
