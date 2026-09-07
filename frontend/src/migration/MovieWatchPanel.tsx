import React, { useState, useMemo } from 'react';
import { useAppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { setCurrentEpId } from '../store/slices/EpListSlice';

export interface EpisodeSummaryDto {
  id: number;
  episodeNumber: number;
  title: string;
  slug?: string;
  url?: string;
}

interface MovieWatchPanelProps {
  initialEpisodes?: EpisodeSummaryDto[];
  movieId: string;
  epId: string;
  schedule?: string;
}

const MovieWatchPanel: React.FC<MovieWatchPanelProps> = ({ initialEpisodes = [], movieId, epId }) => {
  // 1. Dữ liệu giả lập các phần phim
  const parts = [
    { id: 1, name: 'Phần 1', url: '#', active: true },
    { id: 2, name: 'Phần 2', url: '#', active: false },
  ];

  // 2. State quản lý
  const [currentServer, setCurrentServer] = useState(1);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<number | null>(
    initialEpisodes.length > 0 ? initialEpisodes[0].id : null
  );
  const [isAscending, setIsAscending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Logic Lọc & Sắp xếp tập phim chuẩn xác
  const filteredAndSortedEpisodes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // Lọc theo số tập hoặc tiêu đề
    const filtered = initialEpisodes.filter((ep) => {
      const matchNumber = String(ep.episodeNumber).includes(query);
      const matchTitle = ep.title.toLowerCase().includes(query);
      return matchNumber || matchTitle;
    });

    // Sắp xếp tăng dần hoặc giảm dần theo episodeNumber
    return [...filtered].sort((a, b) => {
      return isAscending
        ? a.episodeNumber - b.episodeNumber
        : b.episodeNumber - a.episodeNumber;
    });
  }, [initialEpisodes, searchQuery, isAscending]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelectEpisode = (selectedEpIdentifier: number | string) => {
    const targetEpStr = String(selectedEpIdentifier);
    dispatch(setCurrentEpId(targetEpStr));

    if (movieId) {
      navigate(`/watch/${movieId}/${targetEpStr}`);
    }
  };

  return (
    <div className="watch-movie-v2 info-movie-v2 info-movie-v2--watch">
      <div className="watch-v2-body info-v2-body ah-frame-bg">

        {/* Khung điều hướng chọn phần phim */}
        <nav className="info-parts" aria-label="Các phần phim">
          <ul id="list-movies-part" className="list-movies-part">
            {parts.map((part) => (
              <li key={part.id} className="movies-part">
                <a
                  href={part.url}
                  className={part.active ? 'active' : ''}
                  title={part.name}
                  onClick={e => e.preventDefault()}
                >
                  {part.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Thông tin lịch phát sóng */}
        {/* <p className="info-schedule">
          <i className="hl-calendar"></i> Lịch chiếu vào trưa{' '}
          <a href="/lich-chieu/">Thứ 5</a>, chiếu sớm lúc <strong>18:10</strong> Thứ 4
        </p> */}

        {/* Vùng chọn tập phim chính */}
        <section className="info-block info-block--eps">
          <div className="info-block__head">
            <span className="info-block__title">
              <i className="hl-search"></i> Chọn tập
            </span>

            <div className="info-block__actions">
              {/* Nút Đảo Thứ Tự Tập */}
              <button
                type="button"
                className={`info-ep-sort-btn ${isAscending ? "is-asc" : ""}`}
                id="info-ep-sort"
                aria-pressed={isAscending}
                aria-label="Đảo thứ tự danh sách tập"
                title="Đảo thứ tự tập"
                onClick={() => setIsAscending((prev) => !prev)}
              >
                {!isAscending ? (
                  <svg className="info-ep-sort-icon info-ep-sort-icon--desc" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path d="M6.808 9.467a.5.5 0 0 1-.16-.107l-.288-.298-.86-.889V17a.5.5 0 0 1-1 0V8.173l-.86.89-.286.296a.504.504 0 0 1-.71-.715l1.995-1.996a.5.5 0 0 1 .162-.102l.01-.004a.5.5 0 0 1 .38 0l.008.004a.5.5 0 0 1 .162.102l1.996 1.996.001.001a.5.5 0 0 1 0 .71l-.003.003a.5.5 0 0 1-.547.11M21 7.5H11a.5.5 0 0 1 0-1h10a.5.5 0 1 1 0 1m-10 9h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1m0-5h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1"></path>
                  </svg>
                ) : (
                  <svg className="info-ep-sort-icon info-ep-sort-icon--asc" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path d="m6.36 14.938.286-.297a.503.503 0 0 1 .71.715l-1.995 1.996a.5.5 0 0 1-.162.102l-.01.004-.01.005a.44.44 0 0 1-.357 0l-.01-.005-.011-.004a.5.5 0 0 1-.162-.102l-1.995-1.996a.504.504 0 0 1 .71-.715l.287.297.86.889V7a.5.5 0 1 1 1 0v8.827zM21 7.5H11a.5.5 0 0 1 0-1h10a.5.5 0 1 1 0 1m-10 4h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1m0 5h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1"></path>
                  </svg>
                )}
              </button>

              {/* Ô Tìm Kiếm Tập */}
              <div className="info-block__search">
                <i className="hl-search" aria-hidden="true"></i>
                <input
                  id="keyword-ep"
                  autoComplete="off"
                  placeholder="Nhập số tập"
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>



          {/* Danh Sách Server & Tập Phim */}
          <div className="info-eps-panel collapse in" id="collapseEps">
            <div id="ajax-episode" className="info-eps-content">

              {/* Chọn Server */}
              <div className="text-center halim-ajax-list-server">
                <div id="halim-ajax-list-server">
                  {[
                    { id: 1, name: 'VIP 1' },
                    { id: 2, name: 'VIP 2' },
                    { id: 3, name: 'HX' }
                  ].map((server) => (
                    <span
                      key={server.id}
                      id={`server-item-${server.id}`}
                      className={`get-eps play-listsv box-shadow ${currentServer === server.id ? 'active' : ''}`}
                      onClick={() => setCurrentServer(server.id)}
                    >
                      {server.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hiển thị tập phim */}
              <div id="halim-list-server" className="list-eps-ajax">
                <div className="halim-server show_all_eps">
                  <span className="halim-server-name">
                    <span className="hl-server"></span> Việt Sub
                  </span>
                  {/* Cảnh báo khi không tìm thấy tập */}
                  {filteredAndSortedEpisodes.length === 0 && (
                    <p className="info-eps-empty" id="info-eps-empty" style={{ display: 'block' }}>
                      Không tìm thấy tập phù hợp.
                    </p>
                  )}
                  <ul id="listsv-1" className="halim-list-eps">
                    {filteredAndSortedEpisodes.map((ep) => {
                      const targetIdentifier = ep.episodeNumber;
                      const isCurrent = String(targetIdentifier) === String(epId);
                      return (
                        <li
                          key={ep.id}
                          className={`halim-episode halim-episode-${currentServer} ? 'active' : ''}`}
                        >
                          <a
                            href="#"
                            title={`Tập ${ep.episodeNumber}: ${ep.title}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectEpisode(targetIdentifier);
                            }}
                          >
                            <span className={`box-shadow halim-btn ${isCurrent ? 'active' : ''}`}>
                              {ep.episodeNumber}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="clearfix"></div>
                </div>
                <div id="pagination-1"></div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MovieWatchPanel;