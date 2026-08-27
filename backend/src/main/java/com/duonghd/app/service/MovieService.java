package com.duonghd.app.service;

import com.duonghd.app.dto.request.MovieCreateRequest;
import com.duonghd.app.dto.request.MovieUpdateRequest;
import com.duonghd.app.dto.response.*;
import com.duonghd.app.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface MovieService {
    Page<MovieResponseDto> getAllMovies(Pageable pageable);

    // get movie detail and list ep
    MovieDetailResponseDto getMovieDetail(Long id);

    // admin section
    Page<Movie> getAllMoviesForAd(Pageable pageable);

    MovieDetailResponseAdDto getMovieByIdForAd(Long id);

    @Transactional
    MovieResponseDto createMovie(MovieCreateRequest request);

    @Transactional
    void deleteMovie(Long id);

    @Transactional
    MovieResponseDto updateMovie(Long id, MovieUpdateRequest request);

    Page<MovieResponseDto> searchMovies(String keyword, Pageable pageable);

    ScheduleResponse getScheduleByDay(String day, Pageable pageable);
}
