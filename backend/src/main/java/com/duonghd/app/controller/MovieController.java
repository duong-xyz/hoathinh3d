package com.duonghd.app.controller;

import com.duonghd.app.dto.request.MovieCreateRequest;
import com.duonghd.app.dto.response.MovieDetailResponseAdDto;
import com.duonghd.app.dto.response.MovieDetailResponseDto;
import com.duonghd.app.dto.response.MovieResponseDto;
import com.duonghd.app.dto.response.WatchEpisodeResponseDto;
import com.duonghd.app.model.Movie;
import com.duonghd.app.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<Page<MovieResponseDto>> getAllMovies(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(movieService.getAllMovies(pageable));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<MovieDetailResponseDto> getMovieDetail(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieDetail(id));
    }

    // the admin section
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailResponseAdDto> getMovieByIdForAd(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieByIdForAd(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    public ResponseEntity<MovieResponseDto> createMovie(@Valid @RequestBody MovieCreateRequest request) {
        MovieResponseDto created = movieService.createMovie(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
