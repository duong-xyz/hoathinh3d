package com.duonghd.app.dto.request;

import com.duonghd.app.contant.SourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EpisodeSourceCreateRequest (
        @Size(max = 40, message = "Tên server không quá 40 ký tự")
        String serverName,

        @NotNull(message = "Loại nguồn phát (SourceType) không được để trống")
        SourceType sourceType,

        @NotBlank(message = "URL nguồn phát không được để trống")
        String sourceURL,

        String quality
) {
}
