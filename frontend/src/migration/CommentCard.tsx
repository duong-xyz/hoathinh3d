import React from 'react';

export default function CommentCard({ comment } : {comment: any}) {
  return (
    <a 
      href="#" 
      className={`hh3d-preview-comment-card ${!comment.hasPoster ? 'is-no-poster' : ''} ${comment.isActivity ? 'is-activity' : ''}`}
    >
      {comment.hasPoster && (
        <div className="hh3d-preview-comment-poster-wrap">
          <img src={comment.posterThumb} className="hh3d-preview-comment-poster" alt={comment.movieTitle} />
        </div>
      )}
      
      <div className="hh3d-preview-comment-main">
        <div className={`avatar-container-header adjust-frame ${comment.vipFrame?.length > 0 ? comment.vipFrame : ""}`}>
          <img src={comment.avatar} alt={comment.author} />
        </div>
        <div className="hh3d-preview-comment-body">
          <div className="hh3d-preview-comment-header">
            <span className="hh3d-preview-comment-author-name">{comment.author}</span>
            {comment.isVip && <i className="fas fa-check-circle hh3d-preview-comment-vip" aria-hidden="true" />}
            {comment.isActivity && (
              <span className="hh3d-preview-comment-activity-meta">
                <span className="hh3d-preview-comment-activity-icon">
                  <i className="fas fa-bolt" aria-hidden="true" />
                </span>
              </span>
            )}
            <span className="hh3d-preview-comment-time">{comment.time}</span>
          </div>
          <p className="hh3d-preview-comment-snippet">{comment.text}</p>
          <div className="hh3d-preview-comment-movie-meta">
            <span className="hh3d-preview-comment-at">Tại:</span>
            <span className="hh3d-preview-comment-movie-title">{comment.movieTitle}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
