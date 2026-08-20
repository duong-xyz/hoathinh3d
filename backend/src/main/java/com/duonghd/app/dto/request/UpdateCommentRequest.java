package com.duonghd.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCommentRequest(
        @NotBlank(message = "Nội dung comment không được để trống")
        @Size(max = 1000, message = "Nội dung comment tối đa 1000 ký tự")
        String content
) {
}
