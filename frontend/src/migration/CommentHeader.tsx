// CommentHeader.jsx
import React, { useState } from 'react';

const CommentHeader = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortType, setSortType] = useState("Mới nhất");

  return (
    <div className='wpdcom'>
    <div className="wpd-thread-head">
      <div className="wpd-thread-info">
        <span className="wpdtc" title="104339">104.3K</span> Bình luận
      </div>
      {/* <div className="wpd-thread-info wpdiscuz-user-settings wpd-not-clicked" data-wpd-tooltip="Cài đặt của tôi">
        <i className="fas fa-user-cog" />
      </div> */}
      <div className="wpd-space" />
      <div className="wpd-thread-filter">
        <div className="wpd-filter wpdf-reacted" data-wpd-tooltip="Quan tâm nhiều nhất">
          <i className="fas fa-bolt" />
        </div>
        <div className="wpd-filter wpdf-sorting" onClick={() => setIsSortOpen(!isSortOpen)}>
          <span>{sortType}</span> <i className="fas fa-sort-down" />
          
          <div className="wpdiscuz-sort-buttons" style={{ display: isSortOpen ? "block" : "none" }}>
            <span onClick={() => setSortType("Mới nhất")}>Mới nhất</span>
            <span onClick={() => setSortType("Cũ nhất")}>Cũ nhất</span>
            <span onClick={() => setSortType("Được bỏ phiếu nhiều nhất")}>Được bỏ phiếu nhiều nhất</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CommentHeader;
