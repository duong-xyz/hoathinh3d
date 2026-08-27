export type SourceType = 'HLS' | 'MP4_DIRECT' | 'IFRAME' | 'EMBED_HTML';

export interface EpisodeSourceCreateRequest {
  serverName?: string;
  sourceType: SourceType;
  sourceURL: string;
  quality?: string;
}

export interface EpisodeSourceUpdateRequest {
  serverName?: string;
  sourceType?: SourceType;
  sourceURL?: string;
  quality?: string;
}