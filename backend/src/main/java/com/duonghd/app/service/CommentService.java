package com.duonghd.app.service;

import com.duonghd.app.dto.request.CreateCommentRequest;
import com.duonghd.app.dto.request.UpdateCommentRequest;
import com.duonghd.app.dto.response.CommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface CommentService {
    // get the pageable list root comments
    Page<CommentResponse> getRootComments(Long movieId, Long userId, Pageable pageable);

    // get the replies list of an particular comment when user click to reply
    Page<CommentResponse> getRepliesByParentId(Long parentId, Long userId, Pageable pageable);

    // create comment or reply
    @Transactional
    CommentResponse createComment(Long userId, CreateCommentRequest request);

    @Transactional
    CommentResponse updateComment(Long commentId, Long userId, UpdateCommentRequest request);

    @Transactional
    void deleteComment(Long commentId, Long userId);
}
