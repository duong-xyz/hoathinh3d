package com.duonghd.app.repository;

import com.duonghd.app.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.episodes e WHERE m.id = :id")
    Optional<Movie> findByIdWithEpisodes(@Param("id") Long id);

    @Query("SELECT DISTINCT m FROM Movie m " +
            "LEFT JOIN FETCH m.episodes e " +
            "LEFT JOIN FETCH e.sources " +
            "WHERE m.id = :id")
    Optional<Movie> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(m.originalTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Movie> searchMovies(@Param("keyword") String keyword, Pageable pageable);

    List<Movie> findAllByScheduleIsNotNull();
}
