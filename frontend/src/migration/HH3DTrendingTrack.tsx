import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MovieResponseDto } from '../types/movie';

export default function HH3DTrendingTrack({trendingMovies}:{trendingMovies:MovieResponseDto[]|undefined}):React.JSX.Element {
  const [loadedImages, setLoadedImages] = useState({});
  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };
  const navigate = useNavigate();

  return (
    <div className="halim-trending-track">
      {trendingMovies && trendingMovies.map((movie, index) => {
        const isLoaded = (loadedImages as Record<number, boolean>)[movie.id];

        return (
          <div className="halim-trending-card" key={movie.id}>
            <span onClick={() => navigate(`/detail/${movie.id}`)} className="halim-trending-link">
              
              <div className={`halim-trending-poster-container ${isLoaded ? "halim-trending-poster-loaded" : ""} ${index % 2 === 0 ? "halim-trending-clip-path-odd":"halim-trending-clip-path-even"}`}>
                <div className={`halim-trending-poster-mask ${index % 2 === 0 ? "halim-trending-clip-path-odd":"halim-trending-clip-path-even"}`} />
                
                <img
                  width={224}
                  height={299}
                  src={movie.thumbnailUrl}
                  className="halim-trending-poster-image"
                  alt={movie.title}
                  decoding="async"
                  sizes='auto, (max-width: 480px) 180px, (max-width: 768px) 220px, 224px'
                  loading="lazy"
                  fetchPriority="low"
                  onLoad={() => handleImageLoad(movie.id)} 
                />
                
                <div className="halim-trending-rating">
                  <div className="halim-trending-rating-value">{movie.ratingScore}</div>
                </div>
              </div>

              <div className="halim-trending-info">
                <div className="halim-trending-number">{index + 1}</div>
                <div className="halim-trending-details">
                  <h3 className="halim-trending-title-text">{movie.title}</h3>
                  <p className="halim-trending-original-title">{movie.originalTitle}</p>
                </div>
              </div>

            </span>
          </div>
        );
      })}
    </div>
  );
}
