package com.duonghd.app.controller;

import com.duonghd.app.dto.request.CreateCommentRequest;
import com.duonghd.app.dto.request.UpdateCommentRequest;
import com.duonghd.app.dto.response.CommentResponse;
import com.duonghd.app.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<CommentResponse>> getRootComments(
            @PathVariable Long movieId,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CommentResponse> responses = commentService.getRootComments(movieId, userId, pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{parentId}/replies")
    public ResponseEntity<Page<CommentResponse>> getReplies(
            @PathVariable Long parentId,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<CommentResponse> responses = commentService.getRepliesByParentId(parentId, userId, pageable);
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @RequestParam Long userId, // Có thể thay bằng AuthenticationPrincipal nếu dùng Spring Security
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.createComment(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @RequestParam Long userId,
            @Valid @RequestBody UpdateCommentRequest request) {

        CommentResponse response = commentService.updateComment(commentId, userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {

        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
