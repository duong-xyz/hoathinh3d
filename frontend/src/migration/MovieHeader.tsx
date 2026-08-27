import React, { useState, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MovieDetailResponseDto } from '../types/movie';
import { useAppDispatch } from '../store/store';
import { setPlaylist } from '../store/slices/EpListSlice';

export default function MovieHeader({
  movie,
  categories = [
    { name: "CN Animation", url: "#" },
    { name: "Cổ Trang", url: "#" },
    { name: "Huyền Huyễn", url: "#" },
    { name: "Tiên Hiệp", url: "#" }
  ],
  onRateClick,
}: {movie: MovieDetailResponseDto, categories?:{name:string; url:string}[], onRateClick: React.MouseEventHandler<HTMLButtonElement>}) {
  // 1. Logic Thay đổi trạng thái Theo dõi (Follow / Unfollow)
  const [isFollowing, setIsFollowing] = useState(false);
console.log("detail:", movie);

  // 2. Logic Xử lý Đánh giá phim độc lập
  const [currentScore, setCurrentScore] = useState(movie?.ratingScore);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const navigate = useNavigate();

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
  };

  const handleRateClick = () => {
    if (!hasRated) {
      setTotalVotes(prev => prev + 1);
      setHasRated(true);
      alert(`Cảm ơn bạn đã đánh giá phim ${movie?.title}!`);
    } else {
      alert("Bạn đã đánh giá phim này rồi.");
    }
  };

  const handleScrollToBottom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    window.scrollTo({
      top: document.body.scrollHeight - 1400, 
      behavior: 'smooth'
    });
  };

  const dispatch = useAppDispatch();

  return (
    <header className="info-hero">
      <div className="info-v2-ambient" aria-hidden="true">

        <img
          className="info-v2-ambient__blur"
          src={movie?.thumbnailUrl}
          alt=""
          decoding="async"
        />
        <span className="info-v2-ambient__grain" />
      </div>
      <div className="info-hero__poster">

        <a
          href={movie?.originalTitle}
          className="info-hero__poster-link info-watch-link watch-btn has-history"
          title="Xem tập mới nhất"
          data-has-history="true"
        >

          <img
            className="info-v2-poster-img"
            src={movie?.thumbnailUrl}
            alt={movie?.title}
            decoding="async"
          />
          <span className="info-hero__poster-overlay" aria-hidden="true" />
          <span className="info-hero__poster-play" aria-hidden="true">

            <i className="fa-sharp fa-regular fa-circle-play" />
          </span>
        </a>
      </div>
      <div className="info-hero__body">
        <h1 className="info-hero__title">{movie?.title}</h1>
        <p className="info-hero__alt">{movie?.originalTitle}</p>
        <div className="info-hero__tags">
          <style>{ '.info-hero__tags { --info-accent-1: 0, 165, 165; }' }</style>
          {categories.map((cat, index) => (
            <React.Fragment key={index}>
              <a href={cat.url} rel="category tag">
                {cat.name}
              </a>
              {index < categories.length - 1 && " "}
            </React.Fragment>
          ))}
        </div>
        <ul className="info-hero__facts">
          <li>
            <span className="info-badge info-badge--ep">{`Tập ${movie?.episodes.at(-1)?.episodeNumber}`}</span>
          </li>
          <li>

            <a href="#" rel="tag">

              <i className="hl-calendar" /> {movie?.type}
            </a>
          </li>
          <li>
            <i className="hl-clock" /> {movie?.schedule}
          </li>
        </ul>
        <div className="info-hero__rating">
          <div className="halim-rating-container halim-rating-container--score-only">
            <div className="halim-star-rating">

              <i className="fas fa-star halim-star-icon" aria-hidden="true" />
              <span className="halim-rating-score">{currentScore}</span>
              <span className="halim-rating-slash">/</span>
              <span className="halim-rating-max">5</span>
              <span className="halim-rating-votes">({totalVotes} lượt)</span>
            </div>
          </div>
        </div>
        <div className="info-hero__cta">
          <div
            className="info-hero__cta-tools"
            role="toolbar"
            aria-label="Thao tác phim"
          >

            <button
              type="button"
              className="halim-rating-button info-hero__tool info-hero__tool--rate"
              data-post-id={"#"}
              data-rating={currentScore}
              data-votes={totalVotes}
              data-title={movie?.title}
              onClick={onRateClick}
            >
              <i className="fas fa-star" aria-hidden="true" />
              <span>Đánh giá</span>
            </button>
            <button
              type="button"
              id="bookmark4"
              data-action={isFollowing ? "unfollow" : "follow"}
              className={`info-hero__tool info-hero__tool--follow ${isFollowing ? 'active is-following' : ''}`}
              onClick={handleFollowToggle}
            >

              {/* Icon thay đổi mượt mà dựa trên trạng thái tim rỗng / tim đặc */}
              <i className={isFollowing ? "fas fa-heart" : "far fa-heart"} aria-hidden="true" />
              <span>{isFollowing ? "Đã theo dõi" : "Theo dõi"}</span>
            </button>
            <a
              href="#info-v2-comments"
              className="info-hero__tool info-hero__tool--comment"
              onClick={handleScrollToBottom}
            >

              <i className="far fa-comment" aria-hidden="true" />
              <span>Bình luận</span>
              <span
                className="info-hero__tool-badge info-hero__tool-badge--wide"
                aria-hidden="true"
              >
                {0}
              </span>
            </a>
          </div>
          <div className="info-hero__cta-primary">

            <a
              href="#"
              className="info-btn info-btn--primary info-btn--watch watch-btn has-history"
              title="Xem tập mới nhất"
              onClick={(e) => {e.preventDefault();dispatch(setPlaylist({episodes: movie.episodes, epId: String(movie.episodes.at(-1)?.id)})) ; navigate(`/watch/${movie.id}/${movie.episodes.at(-1)?.episodeNumber}`)}}
            >

              <i
                className="fa-sharp fa-regular fa-circle-play"
                aria-hidden="true"
              />
              <span>Xem Phim</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
