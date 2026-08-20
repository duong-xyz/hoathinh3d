package com.duonghd.app.repository;

import com.duonghd.app.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT DISTINCT c FROM Comment c LEFT JOIN FETCH c.user WHERE c.movie.id = :movieId " +
            "AND c.parent IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findRootCommentsByMovieId(@Param("movieId") Long movieId, Pageable pageable);
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.parent.id = :parentId ORDER BY c.createdAt ASC")
    Page<Comment> findByParentId(@Param("parentId") Long parentId, Pageable pageable);
    int countByParentId(Long parentId);
}
