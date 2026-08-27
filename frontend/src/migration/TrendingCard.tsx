import React, { useState } from 'react';
import type { MovieResponseDto } from '../types/movie';

interface TrendingCardProps {
  movie: MovieResponseDto;
  rank: number;
  isCompact?: boolean;
}

export default function TrendingCard({ movie, rank, isCompact = false }: TrendingCardProps) {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <div className={`hh3d-preview-trending-card is-rank-${rank} ${isCompact ? 'is-compact' : ''}`}>
      <a href={`/movie/${movie.id}`} className="hh3d-preview-trending-card">
        <div className={`hh3d-preview-trending-card-poster-wrap ${isImgLoaded ? 'halim-trending-poster-loaded' : ''}`}>
          <img
            width={224}
            height={299}
            src={movie.thumbnailUrl}
            className="hh3d-preview-trending-card-poster"
            alt={movie.title}
            decoding="async"
            loading="lazy"
            onLoad={() => setIsImgLoaded(true)}
          />
          <div className="hh3d-preview-poster-scrim" />
          <div className="hh3d-preview-trending-rank">{rank}</div>

          {movie.schedule && (
            <div className="hh3d-preview-poster-top">
              <span className="hh3d-preview-poster-chip is-episode">
                <i className="fas fa-play" aria-hidden="true"></i>
                {movie.schedule}
              </span>
            </div>
          )}

          {movie.ratingScore !== null && (
            <div className="hh3d-preview-trending-card-stat is-hot">
              <i className="fas fa-star" aria-hidden="true" />
              <span>{movie.ratingScore.toFixed(1)}</span>
            </div>
          )}
          <div className="hh3d-preview-trending-card-cta" />
        </div>
        
        <div className="hh3d-preview-trending-card-title-wrap">
          <h4 className="hh3d-preview-trending-card-title" title={movie.title}>
            {movie.title}
          </h4>
          {movie.originalTitle && (
            <p className="hh3d-preview-trending-card-subtitle" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              {movie.originalTitle}
            </p>
          )}
        </div>
      </a>
      <div className="hh3d-preview-trending-badge" />
    </div>
  );
}