import type { SourceType } from "./episodeSource";

export type MovieType = 'SINGLE' | 'SERIES';

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  page: PageInfo;
}

export interface EpisodeSummaryDto {
  id: number;
  episodeNumber: number;
  title: string;
}

export interface EpisodeSourceDto {
  id: number;
  serverName: string;
  sourceType: SourceType
  sourceURL: string;
  quality?: string;
}

export interface EpisodeResponseDto {
  id: number;
  episodeNumber: number;
  title: string;
  sources: EpisodeSourceDto[];
}

export interface MovieResponseDto {
  id: number;
  title: string;
  originalTitle: string;
  type: MovieType;
  ratingScore: number | null;
  thumbnailUrl: string;
  schedule: string;
}

export interface MovieDetailResponseDto {
  id: number;
  title: string;
  originalTitle: string;
  type: MovieType;
  ratingScore: number | null;
  thumbnailUrl: string;
  schedule: string;
  description: string;
  episodes: EpisodeSummaryDto[];
}

export interface MovieDetailResponseAdDto {
  id: number;
  title: string;
  originalTitle: string;
  type: MovieType;
  ratingScore: number | null;
  thumbnailUrl: string;
  schedule: string;
  episodes: EpisodeResponseDto[];
}

export interface MovieCreateRequest {
  title: string;
  originalTitle?: string;
  type?: MovieType;
  description?: string;
  thumbnailUrl?: string;
  schedule?: string;
}

export interface MovieUpdateRequest {
  title: string;
  originalTitle?: string;
  type?: MovieType;
  ratingScore: number;
  thumbnailUrl?: string;
  schedule?: string;
  description?: string;
}

export interface ScheduleResponse {
  normalMovies: MovieResponseDto[];
  earlyMovies: MovieResponseDto[];
}