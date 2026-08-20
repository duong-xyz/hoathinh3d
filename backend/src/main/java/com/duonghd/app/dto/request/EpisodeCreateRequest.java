package com.duonghd.app.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EpisodeCreateRequest(
        @NotNull(message = "Số tập không được để trống")
        @Min(value = 1, message = "Số tập phải lớn hơn hoặc bằng 1")
        Integer episodeNumber,
        String title,
        @Min(value = 0, message = "Thời lượng tập phim không được âm")
        Integer duration
) {
}
