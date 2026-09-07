import React, { useState } from 'react';
import { ScheduleUtils } from '../utils/scheduleUtil'

export interface EpisodeSummaryDto {
  id: number;
  episodeNumber: number;
  title: string;
}

interface MovieBodyProps {
  episodes: EpisodeSummaryDto[];
  serverName: string;
  serverId: number;
  des: string;
  schedule?: string;
}

export default function MovieBody({
  episodes = [],
  serverName = "Việt Sub",
  serverId = 1,
  des,
  schedule,
}: MovieBodyProps) {
  const [isAscending, setIsAscending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSortToggle = () => {
    setIsAscending(prev => !prev);
  };

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // Lọc episode dựa trên từ khóa tìm kiếm
  const filteredEps = episodes.filter(ep =>
    String(ep.episodeNumber).toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Sắp xếp tăng/giảm theo episodeNumber
  const displayEps = isAscending
    ? [...filteredEps].sort((a, b) => a.episodeNumber - b.episodeNumber)
    : [...filteredEps].sort((a, b) => b.episodeNumber - a.episodeNumber);

  return (
    <div className="info-v2-body ah-frame-bg">
      <div id="halim_trailer" />

      <nav className="info-parts" aria-label="Các phần phim">
        <ul id="list-movies-part" className="list-movies-part">
          <style>{'.list-movies-part { --info-accent-1: 0, 165, 165; }'}</style>
          <li className="movies-part">
            <a href="https://hoathinh3d.st" className="active" title="Phần Chính">
              Phần Chính
            </a>
          </li>
          {/* <li className="movies-part">
            <a href="https://hoathinh3d.st-than-lam-chi-chien" className="" title="Movie Thần Lâm Chi Chiến">
              Movie Thần Lâm Chi Chiến
            </a>
          </li> */}
        </ul>
      </nav>

      {/* <a href="/xem-phim-tien-nghich/tap-149-sv1.html" className="resume-watch-card">
        <style>{'.info-v2-body .resume-watch-card { --info-accent-1: 0, 165, 165; }'}</style>
        <div className="resume-circle-wrap">
          <svg className="resume-circle-svg" viewBox="0 0 44 44">
            <circle className="resume-circle-bg" cx={22} cy={22} r={18} />
            <circle
              className="resume-circle-fill"
              cx={22}
              cy={22}
              r={18}
              style={{ strokeDashoffset: "82.56" }}
            />
          </svg>
          <span className="resume-circle-pct">27%</span>
        </div>
        <div className="resume-watch-body">
          <div className="resume-watch-label">
            <span className="resume-action-text">Xem tiếp</span> —
            <span className="resume-episode-name">Tập 149</span>
          </div>
          <span className="resume-time-meta">
            Đã xem <b>6p</b>
          </span>
        </div>
        <span className="material-icons resume-watch-arrow">chevron_right</span>
      </a> */}

      <p className="info-schedule">
        <style>{'.info-schedule { --info-accent-1: 0, 165, 165; }'}</style>
        <i className="hl-calendar" /> Lịch chiếu vào trưa&nbsp;
        {(() => {
          const res = ScheduleUtils.toHumanReadable2(schedule);
          if (typeof res === 'string') {
            return <a href="/schedule">{res}</a>;
          }
          return (
            <>
              <a href="/schedule">{res.normal}</a>
              {res.early && (
                <>
                  , chiếu sớm lúc <strong>18:00</strong> {res.early.replace('Sớm: ', '')}
                </>
              )}
            </>
          );
        })()}
      </p>

      <section className="info-block info-block--eps">
        <div className="info-block__head">
          <span className="info-block__title">
            <i className="hl-search" /> Chọn tập
          </span>
          <div className="info-block__actions">
            <button
              type="button"
              className={`info-ep-sort-btn ${isAscending ? 'is-asc' : ''}`}
              id="info-ep-sort"
              aria-pressed={isAscending ? "true" : "false"}
              aria-label={isAscending ? "Sắp xếp: tập cũ trước" : "Sắp xếp: tập mới trước"}
              title="Tập mới → cũ (bấm để đảo)"
              onClick={handleSortToggle}
            >
              <svg className="info-ep-sort-icon info-ep-sort-icon--desc" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="M6.808 9.467a.5.5 0 0 1-.16-.107l-.288-.298-.86-.889V17a.5.5 0 0 1-1 0V8.173l-.86.89-.286.296a.504.504 0 0 1-.71-.715l1.995-1.996a.5.5 0 0 1 .162-.102l.01-.004a.5.5 0 0 1 .38 0l.008.004a.5.5 0 0 1 .162.102l1.996 1.996.001.001a.5.5 0 0 1 0 .71l-.003.003a.5.5 0 0 1-.547.11M21 7.5H11a.5.5 0 0 1 0-1h10a.5.5 0 1 1 0 1m-10 9h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1m0-5h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1" />
              </svg>
              <svg className="info-ep-sort-icon info-ep-sort-icon--asc" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="m6.36 14.938.286-.297a.503.503 0 0 1 .71.715l-1.995 1.996a.5.5 0 0 1-.162.102l-.01.004-.01.005a.44.44 0 0 1-.357 0l-.01-.005-.011-.004a.5.5 0 0 1-.162-.102l-1.995-1.996a.504.504 0 0 1 .71-.715l.287.297.86.889V7a.5.5 0 1 1 1 0v8.827zM21 7.5H11a.5.5 0 0 1 0-1h10a.5.5 0 1 1 0 1m-10 4h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1m0 5h10a.5.5 0 0 1 0 1H11a.5.5 0 0 1 0-1" />
              </svg>
            </button>
            <div className="info-block__search">
              <i className="hl-search" aria-hidden="true" />
              <input
                id="keyword-ep"
                name="q"
                type="text"
                autoComplete="off"
                placeholder="Nhập số tập"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <p className="info-eps-empty" id="info-eps-empty" hidden={filteredEps.length > 0}>
          Không tìm thấy tập phù hợp.
        </p>

        <div className="info-eps-panel collapse" id="collapseEps">
          <div id="ajax-episode" className="info-eps-content">
            <div id="halim-list-server" className="list-eps-ajax">
              <div className="halim-server show_all_eps vip-server">
                <span className="halim-server-name">
                  <span className="hl-server" /> {serverName}
                </span>

                <ul id="listsv-1" className="halim-list-eps">
                  {displayEps.map((ep) => (
                    <li
                      key={ep.id}
                      className={`halim-episode halim-episode-${serverId}-tap-${ep.episodeNumber} col-xs-3 col-sm-2 col-lg-1`}
                    >
                      <a href={`/tap-${ep.episodeNumber}`} title={`Tập ${ep.episodeNumber}`}>
                        <span
                          className={`halim-info-${serverId}-tap-${ep.episodeNumber} box-shadow halim-btn`}
                          data-server={serverId}
                        >
                          {ep.episodeNumber}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="info-story" className="info-block info-block--story">
        <h2 className="info-block__title">Nội dung</h2>
        <div className="video-item halim-entry-box">
          <article
            id="post-20224"
            className="item-content"
            style={isExpanded ? { maxHeight: 'none' } : {}}
          >
            <p>
              {des}
            </p>
          </article>

          <div className="item-content-toggle" onClick={handleToggleExpand} style={{ cursor: 'pointer' }}>
            {!isExpanded && <div className="item-content-gradient" />}
            <span className="show-more">
              {isExpanded ? "Ẩn bớt" : "Xem thêm"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}