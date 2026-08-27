import type { EpisodeSourceDto } from "./movie";

export interface EpisodeCreateRequest {
  episodeNumber: number;
  title?: string;
  duration?: number;
}

export interface EpisodeUpdateRequest {
  episodeNumber?: number;
  title?: string;
}

export interface WatchEpisodeResponseDto {
  movieId: number;
  movieTitle: string;
  episodeId: number;
  episodeNumber: number;
  episodeTitle: string;
  sources: EpisodeSourceDto[];
}