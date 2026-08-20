package com.duonghd.app.repository;

import com.duonghd.app.model.CommentReaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentReactionRepository extends CrudRepository<CommentReaction, Long>
{
    @Query("SELECT r.comment.id, r.reactionType FROM CommentReaction r " +
           "WHERE r.comment.id IN :commentIds AND r.user.id = :userId")
    List<Object[]> findUserReactions(@Param("commentIds") List<Long> commentIds, @Param("userId") Long userId);
}
