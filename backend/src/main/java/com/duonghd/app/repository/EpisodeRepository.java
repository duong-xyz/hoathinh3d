package com.duonghd.app.repository;

import com.duonghd.app.model.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EpisodeRepository extends JpaRepository<Episode, Long> {
    // get an Episode and Movie Context + list sources of this
    @Query("SELECT e FROM Episode e " +
            "JOIN FETCH e.movie m " +
            "LEFT JOIN FETCH e.sources s " +
            "WHERE m.id = :movieId AND e.episodeNumber = :episodeNo")
    Optional<Episode> findByMovieIdAndEpisodeNumberWithSources(
            @Param("movieId") Long movieId,
            @Param("episodeNo") Integer episodeNo);
}
