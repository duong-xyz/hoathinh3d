import React from 'react';
import HH3DRefreshButton from './HH3DRefreshButton'; 
import type { MovieResponseDto, Page } from '../types/movie';
import { movieApi } from '../api/movieApi';
import { Link } from 'react-router-dom';

interface HH3DLatestBoxProps {
  movies: Page<MovieResponseDto> | null;
  setMovies: React.Dispatch<React.SetStateAction<Page<MovieResponseDto> | null>>;
  isApiLoading: boolean;
}

export default function HH3DLatestBox({ movies, setMovies, isApiLoading }: HH3DLatestBoxProps): React.JSX.Element {
  // 1. Lấy totalPages động từ API, fallback về 1
  const totalPages = movies?.page.totalPages || 1;

  // 2. Quy đổi Backend Page Number (0-based) sang UI Page Number (1-based)
  // Ví dụ: backend trả number = 0 => uiPage = 1
  const backendPage = movies?.page.number ?? 0;
  const currentPage = backendPage + 1;

  const handlePageChange = async (targetPage: number, e: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!movies || !movies.content) return;
    
    // Kiểm tra phạm vi trang trên UI (1 đến totalPages)
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;

    // Truyền về Backend dùng 0-based index (targetPage - 1)
    const apiPageIndex = targetPage - 1; 
    const res = await movieApi.getAllMovies(apiPageIndex);
    setMovies(res.data);
  };

  const handleRefreshMovies = () => {
    if (!movies || !movies.content) return;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const shuffledMovies = [...movies.content].sort(() => 0.5 - Math.random());
        setMovies({ ...movies, content: shuffledMovies });
        resolve();
      }, 1000);
    });
  };

  // 3. Hàm render Pagination chuẩn hóa, không bị lặp nút
  const renderPaginationItems = () => {
    const items = [];

    // Nút Trang 1
    items.push(
      <li key={1}>
        {currentPage === 1 ? (
          <span aria-current="page" className="page-numbers current">1</span>
        ) : (
          <a className="page-numbers" href="#" onClick={(e) => handlePageChange(1, e)}>1</a>
        )}
      </li>
    );

    // Dấu 3 chấm đầu
    if (currentPage > 3) {
      items.push(<li key="dots-start"><span className="page-numbers dots">…</span></li>);
    }

    // Các trang ở giữa
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i}>
          {currentPage === i ? (
            <span aria-current="page" className="page-numbers current">{i}</span>
          ) : (
            <a className="page-numbers" href="#" onClick={(e) => handlePageChange(i, e)}>{i}</a>
          )}
        </li>
      );
    }

    // Dấu 3 chấm cuối
    if (currentPage < totalPages - 2) {
      items.push(<li key="dots-end"><span className="page-numbers dots">…</span></li>);
    }

    // Nút Trang cuối (chỉ render nếu totalPages > 1)
    if (totalPages > 1) {
      items.push(
        <li key={totalPages}>
          {currentPage === totalPages ? (
            <span aria-current="page" className="page-numbers current">{totalPages}</span>
          ) : (
            <a className="page-numbers" href="#" onClick={(e) => handlePageChange(totalPages, e)}>{totalPages}</a>
          )}
        </li>
      );
    }

    return items;
  };
  
  return (
    <div id="hh3d-latest-box" className="halim_box halim-schedule-box">
      <div className={`halim-ajax-popular-post-loading ${isApiLoading ? '' : 'hidden'}`} />
      <div className="section-bar clearfix hh3d-latest-bar">
        <h3 className="section-title">
          <span>Mới Cập Nhật</span>
        </h3>
        <HH3DRefreshButton onRefresh={handleRefreshMovies} />
      </div>
      <div
        className={`halim_box hh3d-latest-grid ${isApiLoading ? "is-loading" : ""}`}
        id="hh3d-latest-grid"
        aria-live="polite"
        aria-busy={isApiLoading ? "true" : "false"}
        data-page={currentPage}
      >
        {isApiLoading ? (
          <div className="hh3d-preview-skeleton" aria-hidden="true" style={{ display: 'contents' }}>
            {[...Array(8)].map((_, index) => (
              <article className="col-md-3 col-sm-3 col-xs-6 thumb grid-item hh3d-latest-skel" key={index}>
                <div className="halim-item">
                  <div className="hh3d-latest-skel-figure" />
                  <div className="hh3d-latest-skel-line" />
                  <div className="hh3d-latest-skel-line is-short" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          movies?.content.map((movie) => (
            <article key={movie.id} className={`col-md-3 col-sm-3 col-xs-6 thumb grid-item post-${movie.id}`}>
              <div className="halim-item">
                <Link className="halim-thumb" to={`/detail/${movie.id}`} title={movie.title}>
                  <figure>
                    <img
                      src={movie.thumbnailUrl}
                      className="lazyload img-responsive"
                      alt={movie.title}
                      title={movie.title}
                    />
                  </figure>
                  {movie.ratingScore && (
                    <span className={`halim-card-score ${+movie.ratingScore >= 4 ? "is-high" : ""}`} aria-label={`Đánh giá ${movie.ratingScore}/5`}>
                      <i className="fas fa-star" aria-hidden="true" />
                      <span className="halim-card-score-num">{movie.ratingScore}</span>
                    </span>
                  )}
                  <span className="status">HD</span>
                  {movie.type && <span className="episode">{movie.type}</span>}
                  <div className="icon_overlay" />
                  <div className="halim-post-title-box">
                    <div className="halim-post-title ">
                      <h2 className="entry-title">{movie.title}</h2>
                      <p className="original_title">{movie.originalTitle}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="clearfix" />
      <div className="hh3d-latest-pagination" id="hh3d-latest-pagination">
        <ul className="page-numbers">
          {/* Nút Prev */}
          {currentPage > 1 && (
            <li>
              <a
                className="page-numbers prev"
                href="#"
                onClick={(e) => handlePageChange(currentPage - 1, e)}
              >
                <i className="hl-down-open rotate-left" />
              </a>
            </li>
          )}

          {renderPaginationItems()}

          {/* Nút Next */}
          {currentPage < totalPages && (
            <li>
              <a
                className="page-numbers next"
                href="#"
                onClick={(e) => handlePageChange(currentPage + 1, e)}
              >
                <i className="hl-down-open rotate-right" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}