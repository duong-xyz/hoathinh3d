import React, { useState, useMemo } from 'react';
import TrendingCard from './TrendingCard';
import type { Page, MovieResponseDto } from '../types/movie'; // Điều chỉnh đường dẫn import cho đúng

interface HH3DWidgetPreviewProps {
  moviesData: Page<MovieResponseDto> | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function HH3DWidgetPreview({ 
  moviesData, 
  isLoading = false,
  onRefresh 
}: HH3DWidgetPreviewProps) {
  const [isTrendingExpanded, setIsTrendingExpanded] = useState(false);

  // Tạo BẢN SAO ĐỘC LẬP và sắp xếp (Không làm biến đổi moviesData.content gốc)
  const sortedMovieList = useMemo(() => {
    if (!moviesData?.content) return [];
    
    // 1. [...moviesData.content] tạo một mảng MỚI HOÀN TOÀN (copy nông)
    // 2. Hàm .sort() chỉ thực thi trên mảng mới này
    return [...moviesData.content].sort((a, b) => {
      const titleA = a.originalTitle || '';
      const titleB = b.originalTitle || '';
      return titleA.localeCompare(titleB, 'vi', { sensitivity: 'base' });
    });
  }, [moviesData]);

  // Cắt danh sách từ mảng đã được copy & sắp xếp
  const initialTrendingMovies = sortedMovieList.slice(0, 5);
  const extendedTrendingMovies = sortedMovieList.slice(5);

  return (
    <div className="hh3d-widget-preview" id="hh3d-widget-preview">
      <section className="hh3d-preview-section hh3d-preview-trending-block" aria-label="Đang sôi nổi">
        <header className="hh3d-preview-section-header hh3d-preview-section-header--compact">
          <h3 className="hh3d-preview-section-title">
            <i className="fas fa-fire" aria-hidden="true" />
            <span className="hh3d-preview-section-title-text">Đang sôi nổi</span>
          </h3>
          <button
            type="button"
            className="hh3d-preview-refresh-btn hh3d-preview-refresh-btn--sm"
            id="hh3d-preview-refresh-trending"
            aria-label="Làm mới danh sách phim hot"
            onClick={onRefresh}
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </header>

        <div className="hh3d-preview-trending-carousel-wrap">
          <div
            className="hh3d-preview-trending-carousel"
            id="hh3d-preview-trending-container"
            aria-busy={isLoading ? "true" : "false"}
          >
            {isLoading ? (
              <div className="hh3d-preview-skeleton hh3d-preview-skeleton-trending" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div className="hh3d-preview-skeleton-card" key={i}>
                    <div className="hh3d-preview-skeleton-bone hh3d-preview-skeleton-poster is-cinematic" />
                    <div className="hh3d-preview-skeleton-bone hh3d-preview-skeleton-line is-title" />
                    <div className="hh3d-preview-skeleton-bone hh3d-preview-skeleton-line is-title-2" />
                  </div>
                ))}
              </div>
            ) : (
              initialTrendingMovies.map((movie, index) => (
                <TrendingCard key={movie.id} movie={movie} rank={index + 1} />
              ))
            )}
          </div>
        </div>

        <div
          className="hh3d-preview-trending-extended"
          id="hh3d-preview-trending-extended"
          hidden={!isTrendingExpanded} 
        >
          <div
            className="hh3d-preview-trending-extended-grid"
            id="hh3d-preview-trending-extended-container"
            aria-hidden={!isTrendingExpanded ? "true" : "false"}
          >
            {isTrendingExpanded && extendedTrendingMovies.map((movie, index) => (
              <TrendingCard key={movie.id} movie={movie} rank={index + 6} isCompact={true} />
            ))}
          </div>
        </div>

        {!isLoading && sortedMovieList.length > 5 && (
          <div className="hh3d-preview-trending-footer" id="hh3d-preview-trending-footer">
            <button
              type="button"
              className={`hh3d-preview-rank-toggle ${isTrendingExpanded ? 'is-expanded' : ''}`}
              id="hh3d-preview-rank-toggle"
              aria-expanded={isTrendingExpanded ? "true" : "false"}
              onClick={() => setIsTrendingExpanded(!isTrendingExpanded)}
            >
              <span className="hh3d-preview-rank-toggle-label">
                {isTrendingExpanded ? 'Thu gọn' : 'Xem đầy đủ'}
              </span>
              <i className="fas fa-chevron-down hh3d-preview-rank-toggle-icon" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}