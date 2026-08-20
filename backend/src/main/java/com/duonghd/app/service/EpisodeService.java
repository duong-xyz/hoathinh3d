package com.duonghd.app.service;

import com.duonghd.app.dto.request.EpisodeCreateRequest;
import com.duonghd.app.dto.request.EpisodeUpdateRequest;
import com.duonghd.app.dto.response.EpisodeSummaryDto;
import com.duonghd.app.dto.response.WatchEpisodeResponseDto;
import org.springframework.transaction.annotation.Transactional;

public interface EpisodeService {
    // get the unique data stream for a single ep
    @Transactional(readOnly = true)
    WatchEpisodeResponseDto getWatchData(Long movieId, Integer episodeNumber);

    @Transactional
    EpisodeSummaryDto createEpisode(Long movieId, EpisodeCreateRequest request);

    @Transactional
    EpisodeSummaryDto updateEpisode(Long episodeId, EpisodeUpdateRequest request);

    @Transactional
    void deleteEpisode(Long episodeId);
}
