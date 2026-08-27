import axiosClient from './axiosClient';
import type { EpisodeSourceCreateRequest, EpisodeSourceUpdateRequest } from '../types/episodeSource';

export const episodeSourceApi = {
  createSource: (episodeId: number, data: EpisodeSourceCreateRequest) =>
    axiosClient.post<any>(`/episode-sources/${episodeId}`, data),

  updateSource: (id: number, data: EpisodeSourceUpdateRequest) =>
    axiosClient.put<any>(`/episode-sources/${id}`, data),

  deleteSource: (id: number) =>
    axiosClient.delete<void>(`/episode-sources/${id}`),
};