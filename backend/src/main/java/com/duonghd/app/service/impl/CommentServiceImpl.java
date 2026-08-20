package com.duonghd.app.service.impl;

import com.duonghd.app.contant.ReactionType;
import com.duonghd.app.dto.request.CreateCommentRequest;
import com.duonghd.app.dto.request.UpdateCommentRequest;
import com.duonghd.app.dto.response.CommentResponse;
import com.duonghd.app.dto.response.UserSummaryDto;
import com.duonghd.app.model.Comment;
import com.duonghd.app.model.Movie;
import com.duonghd.app.model.User;
import com.duonghd.app.repository.CommentReactionRepository;
import com.duonghd.app.repository.CommentRepository;
import com.duonghd.app.repository.MovieRepository;
import com.duonghd.app.repository.UserRepository;
import com.duonghd.app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentReactionRepository commentReactionRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    // get the pageable list root comments
    @Override
    public Page<CommentResponse> getRootComments(Long movieId, Long userId, Pageable pageable) {
        Page<Comment> rootCommentsPage = commentRepository.findRootCommentsByMovieId(movieId, pageable);
        List<Comment> rootComments = rootCommentsPage.getContent();
        if(rootComments.isEmpty()) return Page.empty(pageable);

        List<Long> commentIds = rootComments.stream().map(Comment::getId).toList();
        Map<Long, ReactionType> userReactionsMap = getUserReactionsMap(commentIds, userId);

        return rootCommentsPage.map(c -> new CommentResponse(
                c.getId(),
                c.getContent(),
                c.getReactionCount(),
                c.getReplies() != null ? c.getReplies().size() : 0,
                c.getCreatedAt(),
                new UserSummaryDto(c.getUser().getId(), c.getUser().getUsername(), null),
                userReactionsMap.get(c.getId())
        ));
    }

    // get the replies list of a particular comment when user click to reply
    @Override
    public Page<CommentResponse> getRepliesByParentId(Long parentId, Long userId, Pageable pageable) {
        Page<Comment> repliesPage = commentRepository.findByParentId(parentId, pageable);
        List<Comment> replies = repliesPage.getContent();
        if (replies.isEmpty()) return Page.empty(pageable);

        List<Long> replyIds = replies.stream().map(Comment::getId).toList();
        Map<Long, ReactionType> userReactionsMap = getUserReactionsMap(replyIds, userId);

        return repliesPage.map(c -> new CommentResponse(
                c.getId(),
                c.getContent(),
                c.getReactionCount(),
                c.getReplies() != null ? c.getReplies().size() : 0,
                c.getCreatedAt(),
                new UserSummaryDto(c.getUser().getId(), c.getUser().getUsername(), null),
                userReactionsMap.get(c.getId())
        ));
    }

    private Map<Long, ReactionType> getUserReactionsMap(List<Long> commentIds, Long userId) {
        Map<Long, ReactionType> map = new HashMap<>();
        if(userId != null && !commentIds.isEmpty()) {
            List<Object[]> reactions = commentReactionRepository.findUserReactions(commentIds, userId);
//            for (Object[] row : reactions) {
//                map.put((Long) row[0], (ReactionType) row[1]);
//            }
            map = reactions.stream().collect(Collectors.toMap(
                    row -> (Long) row[0],
                    row -> (ReactionType) row[1]
            ));
        }
        return map;
    }

    // create comment or reply
    @Transactional
    @Override
    public CommentResponse createComment(Long userId, CreateCommentRequest request) {
        // getReferenceById created H Proxy object with userId in RAM
        User userRef = userRepository.getReferenceById(userId);
        Movie movieRef = movieRepository.getReferenceById(request.movieId());

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> new IllegalArgumentException("Comment cha không tồn tại"));

            if (!parent.getMovie().getId().equals(request.movieId())) {
                throw new IllegalArgumentException("Comment cha không thuộc phim này");
            }
        }

        Comment comment = Comment.builder()
                .movie(movieRef)
                .user(userRef)
                .parent(parent)
                .content(request.content())
                .reactionCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        // call userRef.getUsername() only used 1 SQL SELECT User if Proxy isn't initialized
        return new CommentResponse(
                savedComment.getId(),
                savedComment.getContent(),
                0,
                0,
                savedComment.getCreatedAt(),
                new UserSummaryDto(userRef.getId(), userRef.getUsername(), null),
                null
        );
    }

    @Transactional
    @Override
    public CommentResponse updateComment(Long commentId, Long userId, UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment không tồn tại"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new SecurityException("Bạn không có quyền sửa comment này");
        }

        // not save(). JPA Dirty Checking will auto UPDATE.
        comment.setContent(request.content());
        int replyCount = commentRepository.countByParentId(commentId);

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getReactionCount(),
                replyCount,
                comment.getCreatedAt(),
                new UserSummaryDto(comment.getUser().getId(), comment.getUser().getUsername(), null),
                null
        );
    }

    @Transactional
    @Override
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment không tồn tại"));
        if (!comment.getUser().getId().equals(userId)) {
            throw new SecurityException("Bạn không có quyền xóa comment này");
        }
        commentRepository.delete(comment);
    }
}
