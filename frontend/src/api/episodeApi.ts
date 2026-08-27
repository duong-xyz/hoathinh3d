import axiosClient from './axiosClient';
import type { EpisodeCreateRequest, EpisodeUpdateRequest, WatchEpisodeResponseDto } from '../types/episode';

export const episodeApi = {
  getWatchData: (movieId: number, ep: number = 1) =>
    axiosClient.get<WatchEpisodeResponseDto>('/episodes/watch', {
      params: { movieId, ep },
    }),

  createEpisode: (movieId: number, data: EpisodeCreateRequest) =>
    axiosClient.post<any>(`/episodes/movie/${movieId}`, data),

  updateEpisode: (id: number, data: EpisodeUpdateRequest) =>
    axiosClient.put<any>(`/episodes/${id}`, data),

  deleteEpisode: (id: number) =>
    axiosClient.delete<void>(`/episodes/${id}`),
};