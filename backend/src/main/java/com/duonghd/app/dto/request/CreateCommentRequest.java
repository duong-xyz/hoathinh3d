package com.duonghd.app.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// used to create a top-level comment or a reply to another comment(parent can be null)
public record CreateCommentRequest(
        @NotNull(message = "Movie ID không được để trống")
        Long movieId,
        Long parentId,
        @NotBlank(message = "Nội dung comment không được để trống")
        @Size(max = 1000, message = "Nội dung comment tối đa 1000 ký tự")
        String content
) {
}
