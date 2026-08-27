import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieComments } from '../components/MovieComments';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number(id) : 0;

  return (
    <div className="movie-detail-container" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Thông tin phim, video player... ở đây */}
      <h1>Chi tiết Phim #{movieId}</h1>

      {/* Nhúng phần bình luận */}
      <MovieComments movieId={movieId} />
    </div>
  );
};