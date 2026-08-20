package com.duonghd.app.service;

import com.duonghd.app.dto.request.EpisodeSourceCreateRequest;
import com.duonghd.app.dto.request.EpisodeSourceUpdateRequest;
import com.duonghd.app.dto.response.EpisodeSourceDto;
import org.springframework.transaction.annotation.Transactional;

public interface EpisodeSourceService {
    @Transactional
    EpisodeSourceDto createSource(Long episodeId, EpisodeSourceCreateRequest request);

    @Transactional
    EpisodeSourceDto updateSource(Long sourceId, EpisodeSourceUpdateRequest request);

    @Transactional
    void deleteSource(Long sourceId);
}
