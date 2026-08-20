package com.duonghd.app.service.impl;

import com.duonghd.app.dto.request.EpisodeCreateRequest;
import com.duonghd.app.dto.request.EpisodeUpdateRequest;
import com.duonghd.app.dto.response.EpisodeSourceDto;
import com.duonghd.app.dto.response.EpisodeSummaryDto;
import com.duonghd.app.dto.response.WatchEpisodeResponseDto;
import com.duonghd.app.model.Episode;
import com.duonghd.app.model.Movie;
import com.duonghd.app.repository.EpisodeRepository;
import com.duonghd.app.repository.MovieRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EpisodeServiceImpl implements com.duonghd.app.service.EpisodeService {
    private final EpisodeRepository episodeRepository;
    private final MovieRepository movieRepository;

    // get the unique data stream for a single ep
    @Transactional(readOnly = true)
    @Override
    public WatchEpisodeResponseDto getWatchData(Long movieId, Integer episodeNumber) {
        Episode episode = episodeRepository.findByMovieIdAndEpisodeNumberWithSources(movieId, episodeNumber)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Không tìm thấy tập %d của phim ID %d", episodeNumber, movieId)));

        List<EpisodeSourceDto> sources = episode.getSources().stream()
                .map(s -> new EpisodeSourceDto(s.getId(), s.getServerName(), s.getSourceType(), s.getSourceURL(), s.getQuality()))
                .toList();

        return new WatchEpisodeResponseDto(
                episode.getMovie().getId(), episode.getMovie().getTitle(),
                episode.getId(), episode.getEpisodeNumber(), episode.getTitle(), sources
        );
    }

    @Transactional
    @Override
    public EpisodeSummaryDto createEpisode(Long movieId, EpisodeCreateRequest request) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phim ID: " + movieId));

        Episode episode = Episode.builder()
                .movie(movie)
                .episodeNumber(request.episodeNumber())
                .title(request.title())
                .build();

        Episode saved = episodeRepository.save(episode);
        return new EpisodeSummaryDto(saved.getId(), saved.getEpisodeNumber(), saved.getTitle());
    }

    @Transactional
    @Override
    public EpisodeSummaryDto updateEpisode(Long episodeId, EpisodeUpdateRequest request) {
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tập phim ID: " + episodeId));

        if (request.episodeNumber() != null) episode.setEpisodeNumber(request.episodeNumber());
        if (request.title() != null) episode.setTitle(request.title());

        return new EpisodeSummaryDto(episode.getId(), episode.getEpisodeNumber(), episode.getTitle());
    }

    @Transactional
    @Override
    public void deleteEpisode(Long episodeId) {
        if (!episodeRepository.existsById(episodeId)) {
            throw new EntityNotFoundException("Không tìm thấy tập phim ID: " + episodeId);
        }
        episodeRepository.deleteById(episodeId);
    }
}
