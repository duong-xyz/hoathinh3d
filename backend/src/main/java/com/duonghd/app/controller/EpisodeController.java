package com.duonghd.app.controller;

import com.duonghd.app.dto.request.EpisodeCreateRequest;
import com.duonghd.app.dto.request.EpisodeUpdateRequest;
import com.duonghd.app.dto.response.EpisodeSummaryDto;
import com.duonghd.app.dto.response.WatchEpisodeResponseDto;
import com.duonghd.app.service.EpisodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/episodes")
@RequiredArgsConstructor
public class EpisodeController {
    private final EpisodeService episodeService;

    // Ví dụ: GET /api/v1/episodes/watch?movieId=1&ep=2
    @GetMapping("/watch")
    public ResponseEntity<WatchEpisodeResponseDto> getWatchData(
            @RequestParam Long movieId,
            @RequestParam(name = "ep", defaultValue = "1") Integer episodeNumber) {
        return ResponseEntity.ok(episodeService.getWatchData(movieId, episodeNumber));
    }

    @PostMapping("/movie/{movieId}")
    public ResponseEntity<EpisodeSummaryDto> createEpisode(
            @PathVariable Long movieId,
            @Valid @RequestBody EpisodeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(episodeService.createEpisode(movieId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EpisodeSummaryDto> updateEpisode(
            @PathVariable Long id,
            @RequestBody EpisodeUpdateRequest request) {
        return ResponseEntity.ok(episodeService.updateEpisode(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable Long id) {
        episodeService.deleteEpisode(id);
        return ResponseEntity.noContent().build();
    }
}
