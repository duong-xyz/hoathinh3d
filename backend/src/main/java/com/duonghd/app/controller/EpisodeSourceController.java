package com.duonghd.app.controller;

import com.duonghd.app.dto.request.EpisodeSourceCreateRequest;
import com.duonghd.app.dto.request.EpisodeSourceUpdateRequest;
import com.duonghd.app.dto.response.EpisodeSourceDto;
import com.duonghd.app.service.EpisodeSourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/episode-sources")
@RequiredArgsConstructor
public class EpisodeSourceController {
    private final EpisodeSourceService sourceService;

    @PostMapping("/{epSourceId}")
    public ResponseEntity<EpisodeSourceDto> createSource(
            @PathVariable Long epSourceId,
            @Valid @RequestBody EpisodeSourceCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sourceService.createSource(epSourceId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EpisodeSourceDto> updateSource(
            @PathVariable Long id,
            @Valid @RequestBody EpisodeSourceUpdateRequest request) {
        return ResponseEntity.ok(sourceService.updateSource(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSource(@PathVariable Long id) {
        sourceService.deleteSource(id);
        return ResponseEntity.noContent().build();
    }
}
