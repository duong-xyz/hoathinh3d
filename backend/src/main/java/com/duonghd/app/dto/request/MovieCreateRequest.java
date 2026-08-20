package com.duonghd.app.dto.request;

import com.duonghd.app.contant.MovieType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MovieCreateRequest(
        @NotBlank(message = "Tên phim không được để trống")
        String title,
        String originalTitle,
        @NotNull(message = "Loại phim (MovieType) không được để trống")
        MovieType type,
        @Size(max = 500, message = "URL ảnh thu nhỏ không vượt quá 500 ký tự")
        String thumbnailUrl,
        @Size(max = 255, message = "Lịch chiếu không vượt quá 255 ký tự")
        String schedule,
        String description
) {
}
