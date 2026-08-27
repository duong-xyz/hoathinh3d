import React, { useState } from 'react';

export default function MovieRatingModal({
  isOpen = false,
  onClose,
  movieTitle = "Tiên Nghịch",
  ratingScore,
  ratingVotes = 0,
  onSubmitRating
}: any):React.JSX.Element | null {
  const [selectedRating, setSelectedRating] = useState(null);

  if (!isOpen) return null;

  const handleOptionClick = (value) => {
    setSelectedRating(value);
  };

  const handleSubmit = () => {
    if (selectedRating === null) {
      alert("Vui lòng chọn một mức đánh giá trước khi gửi!");
      return;
    }
    // Gửi giá trị điểm được chọn lên hàm xử lý ở component cha (ví dụ gọi API)
    if (onSubmitRating) {
      onSubmitRating(selectedRating);
    }
  };

  return (
    <div className="movie-rating-modal-overlay" id="ratingModal">
      <div className="movie-rating-modal">
        <div className="movie-rating-modal-header">
          <button 
            className="movie-rating-modal-close" 
            id="closeModalBtn"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="movie-rating-movie-title">{movieTitle}</h2>
          <div className="movie-rating-movie-rating">
            <span className="movie-rating-rating-icon">★</span>
            <span>{ratingScore}/5 ({ratingVotes} lượt đánh giá)</span>
          </div>
        </div>
        <div className="movie-rating-modal-body">
          <h3 className="movie-rating-rating-title">
            Bạn đánh giá phim này thế nào?
          </h3>
          <div className="movie-rating-rating-options" id="ratingOptions">
            
            {/* Tùy chọn 5 Sao - Đỉnh nóc */}
            <div 
              className={`movie-rating-rating-option ${selectedRating === 5 ? 'selected' : ''}`} 
              data-value={5}
              onClick={() => handleOptionClick(5)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/stickers/rate-5.webp"
                alt="Đỉnh nóc"
              />
              <span className="movie-rating-rating-option-text">Đỉnh nóc</span>
            </div>

            {/* Tùy chọn 4 Sao - Hay ho */}
            <div 
              className={`movie-rating-rating-option ${selectedRating === 4 ? 'selected' : ''}`} 
              data-value={4}
              onClick={() => handleOptionClick(4)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/stickers/rate-4.webp"
                alt="Hay ho"
              />
              <span className="movie-rating-rating-option-text">Hay ho</span>
            </div>

            {/* Tùy chọn 3 Sao - Tạm ổn */}
            <div 
              className={`movie-rating-rating-option ${selectedRating === 3 ? 'selected' : ''}`} 
              data-value={3}
              onClick={() => handleOptionClick(3)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/stickers/rate-3.webp"
                alt="Tạm ổn"
              />
              <span className="movie-rating-rating-option-text">Tạm ổn</span>
            </div>

            {/* Tùy chọn 2 Sao - Nhạt nhòa */}
            <div 
              className={`movie-rating-rating-option ${selectedRating === 2 ? 'selected' : ''}`} 
              data-value={2}
              onClick={() => handleOptionClick(2)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/stickers/rate-2.webp"
                alt="Nhạt nhòa"
              />
              <span className="movie-rating-rating-option-text">Nhạt nhòa</span>
            </div>

            {/* Tùy chọn 1 Sao - Thảm họa */}
            <div 
              className={`movie-rating-rating-option ${selectedRating === 1 ? 'selected' : ''}`} 
              data-value={1}
              onClick={() => handleOptionClick(1)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/stickers/rate-1.webp"
                alt="Thảm họa"
              />
              <span className="movie-rating-rating-option-text">Thảm họa</span>
            </div>

          </div>
        </div>
        <div className="movie-rating-modal-footer">
          <button
            className="movie-rating-btn movie-rating-btn-primary"
            id="submitRatingBtn"
            onClick={handleSubmit}
          >
            Gửi đánh giá
          </button>
          <button
            className="movie-rating-btn movie-rating-btn-secondary"
            id="cancelBtn"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
