package com.duonghd.app.dto.request;

import jakarta.validation.constraints.Min;

public record EpisodeUpdateRequest(
        @Min(value = 1, message = "Số tập phải lớn hơn hoặc bằng 1")
        Integer episodeNumber,
        String title
) {
}
