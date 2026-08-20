package com.duonghd.app.dto.response;

import com.duonghd.app.contant.ReactionType;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        Integer reactionCount,
        Integer replyCount,
        LocalDateTime createdAt,
        UserSummaryDto user,
        ReactionType currentUserReaction
) {
    public CommentResponse {
        if (reactionCount == null) reactionCount = 0;
        if (replyCount == null) replyCount = 0;
    }
}
