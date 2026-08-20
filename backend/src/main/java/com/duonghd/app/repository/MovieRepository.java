package com.duonghd.app.repository;

import com.duonghd.app.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.episodes e WHERE m.id = :id")
    Optional<Movie> findByIdWithEpisodes(@Param("id") Long id);

    @Query("SELECT DISTINCT m FROM Movie m " +
            "LEFT JOIN FETCH m.episodes e " +
            "LEFT JOIN FETCH e.sources " +
            "WHERE m.id = :id")
    Optional<Movie> findByIdWithDetails(@Param("id") Long id);
}
