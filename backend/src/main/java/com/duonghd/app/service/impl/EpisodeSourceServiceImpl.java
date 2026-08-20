package com.duonghd.app.service.impl;

import com.duonghd.app.dto.request.EpisodeSourceCreateRequest;
import com.duonghd.app.dto.request.EpisodeSourceUpdateRequest;
import com.duonghd.app.dto.response.EpisodeSourceDto;
import com.duonghd.app.model.Episode;
import com.duonghd.app.model.EpisodeSource;
import com.duonghd.app.repository.EpisodeRepository;
import com.duonghd.app.repository.EpisodeSourceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EpisodeSourceServiceImpl implements com.duonghd.app.service.EpisodeSourceService {
    private final EpisodeSourceRepository sourceRepository;
    private final EpisodeRepository episodeRepository;

    @Transactional
    @Override
    public EpisodeSourceDto createSource(Long episodeId, EpisodeSourceCreateRequest request) {
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tập phim ID: " + episodeId));

        EpisodeSource source = EpisodeSource.builder()
                .episode(episode)
                .serverName(request.serverName())
                .sourceType(request.sourceType())
                .sourceURL(request.sourceURL())
                .quality(request.quality())
                .build();

        EpisodeSource saved = sourceRepository.save(source);
        return new EpisodeSourceDto(saved.getId(), saved.getServerName(), saved.getSourceType(), saved.getSourceURL(), saved.getQuality());
    }

    @Transactional
    @Override
    public EpisodeSourceDto updateSource(Long sourceId, EpisodeSourceUpdateRequest request) {
        EpisodeSource source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nguồn phim ID: " + sourceId));

        if (request.serverName() != null) source.setServerName(request.serverName());
        if (request.sourceType() != null) source.setSourceType(request.sourceType());
        if (request.sourceURL() != null) source.setSourceURL(request.sourceURL());
        if (request.quality() != null) source.setQuality(request.quality());

        return new EpisodeSourceDto(source.getId(), source.getServerName(), source.getSourceType(), source.getSourceURL(), source.getQuality());
    }

    @Transactional
    @Override
    public void deleteSource(Long sourceId) {
        if (!sourceRepository.existsById(sourceId)) {
            throw new EntityNotFoundException("Không tìm thấy nguồn phim ID: " + sourceId);
        }
        sourceRepository.deleteById(sourceId);
    }
}
