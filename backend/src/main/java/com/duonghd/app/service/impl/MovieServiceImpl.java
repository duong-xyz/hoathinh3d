package com.duonghd.app.service.impl;

import com.duonghd.app.dto.request.MovieCreateRequest;
import com.duonghd.app.dto.request.MovieUpdateRequest;
import com.duonghd.app.dto.response.*;
import com.duonghd.app.model.Episode;
import com.duonghd.app.model.Movie;
import com.duonghd.app.repository.EpisodeRepository;
import com.duonghd.app.repository.EpisodeSourceRepository;
import com.duonghd.app.repository.MovieRepository;
import com.duonghd.app.service.MovieService;
import com.duonghd.app.util.ScheduleUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimize to the read operation
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final EpisodeRepository episodeRepository;

    @Override
    public Page<MovieResponseDto> getAllMovies(Pageable pageable) {
        return movieRepository.findAll(pageable)
                .map(this::mapToMovieResponseDto);
    }

    // get movie detail and list ep
    @Override
    public MovieDetailResponseDto getMovieDetail(Long id) {
        Movie movie = movieRepository.findByIdWithEpisodes(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phim ID: " + id));

        List<EpisodeSummaryDto> episodeSummaries = movie.getEpisodes().stream()
                .map(e -> new EpisodeSummaryDto(
                        e.getId(),
                        e.getEpisodeNumber(),
                        e.getTitle()
                )).toList();

        return new MovieDetailResponseDto(
                movie.getId(), movie.getTitle(), movie.getOriginalTitle(),
                movie.getType(), movie.getRatingScore(), movie.getThumbnailUrl(),
                movie.getSchedule(), movie.getDescription(), episodeSummaries
        );
    }

    // admin section
    @Override
    public Page<Movie> getAllMoviesForAd(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }

    @Override
    public MovieDetailResponseAdDto getMovieByIdForAd(Long id) {
        Movie movie = movieRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phim với ID: " + id));
        return mapToMovieDetailDto(movie);
    }

    @Transactional
    @Override
    public MovieResponseDto createMovie(MovieCreateRequest request) {
        Movie movie = Movie.builder()
                .title(request.title())
                .originalTitle(request.originalTitle())
                .type(request.type())
                .thumbnailUrl(request.thumbnailUrl())
                .schedule(request.schedule())
                .description(request.description())
                .build();

        Movie savedMovie = movieRepository.save(movie);
        return mapToMovieResponseDto(savedMovie);
    }

    @Transactional
    @Override
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy phim với ID: " + id);
        }
        movieRepository.deleteById(id);
    }

    @Transactional
    @Override
    public MovieResponseDto updateMovie(Long id, MovieUpdateRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phim với ID: " + id));

        // auto update by Dirty Checking on the end of Transaction
        if (request.title() != null) movie.setTitle(request.title());
        if (request.originalTitle() != null) movie.setOriginalTitle(request.originalTitle());
        if (request.type() != null) movie.setType(request.type());
        if (request.ratingScore() != null) movie.setRatingScore(request.ratingScore());
        if (request.thumbnailUrl() != null) movie.setThumbnailUrl(request.thumbnailUrl());
        if (request.schedule() != null) movie.setSchedule(request.schedule());
        if (request.description() != null) movie.setDescription(request.description());

        return mapToMovieResponseDto(movie);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovieResponseDto> searchMovies(String keyword, Pageable pageable) {
        if(keyword == null || keyword.trim().isEmpty()) {
            return movieRepository.findAll(pageable).map(this::mapToMovieResponseDto);
        }
        return movieRepository.searchMovies(keyword.trim(), pageable).map(this::mapToMovieResponseDto);
    }

    @Override
    public ScheduleResponse getScheduleByDay(String day, Pageable pageable) {
        int targetBit = ScheduleUtils.getBitForDay(day);
        if (targetBit == 0) {
            return new ScheduleResponse(Collections.emptyList(), Collections.emptyList());
        }

        List<Movie> allMovies = movieRepository.findAllByScheduleIsNotNull();

        List<Movie> normal = new ArrayList<>();
        List<Movie> early = new ArrayList<>();

        for (Movie m : allMovies) {
            String schedule = m.getSchedule();
            if (schedule == null || !schedule.contains("|")) continue;

            String[] parts = schedule.split("\\|", 3);
            if (parts.length < 3) continue;

            try {
                int normalBitmask = Integer.parseInt(parts[1]);
                int earlyBitmask = Integer.parseInt(parts[2]);
                if ((normalBitmask & targetBit) != 0) normal.add(m);
                if ((earlyBitmask & targetBit) != 0) early.add(m);
            } catch (NumberFormatException ignored) {
            }
        }

        // paginate on RAM and mapping to dto
        return new ScheduleResponse(
                paginateAndMap(normal, pageable),
                paginateAndMap(early, pageable)
        );
    }

    private List<MovieResponseDto> paginateAndMap(List<Movie> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        if (start >= list.size()) return Collections.emptyList();

        int end = Math.min(start + pageable.getPageSize(), list.size());

        return list.subList(start, end).stream()
                .map(this::mapToMovieResponseDto)
                .toList();
    }

    private MovieResponseDto mapToMovieResponseDto(Movie movie) {
        return new MovieResponseDto(
                movie.getId(), movie.getTitle(), movie.getOriginalTitle(),
                movie.getType(), movie.getRatingScore(), movie.getThumbnailUrl(), movie.getSchedule()
        );
    }

    private MovieDetailResponseAdDto mapToMovieDetailDto(Movie movie) {
        List<EpisodeResponseDto> episodes = movie.getEpisodes().stream()
                .map(e -> new EpisodeResponseDto(
                        e.getId(), e.getEpisodeNumber(), e.getTitle(),
                        e.getSources().stream()
                                .map(s -> new EpisodeSourceDto(s.getId(), s.getServerName(), s.getSourceType(), s.getSourceURL(), s.getQuality()))
                                .toList()
                )).toList();

        return new MovieDetailResponseAdDto(
                movie.getId(), movie.getTitle(), movie.getOriginalTitle(),
                movie.getType(), movie.getRatingScore(), movie.getThumbnailUrl(),
                movie.getSchedule(), episodes
        );
    }
}
