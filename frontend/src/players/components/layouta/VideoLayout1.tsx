import React, { useEffect } from 'react';
import {
  Controls,
  Gesture,
  useMediaPlayer,
  PlayButton,
  MuteButton,
  CaptionButton,
  PIPButton,
  FullscreenButton,
  Tooltip,
  useMediaState,
  isTrackCaptionKind,
  Menu,
  useCaptionOptions,
  TimeSlider,
  VolumeSlider,
  Time,
  SeekButton,
} from '@vidstack/react';
import {
  PlayIcon,
  PauseIcon,
  MuteIcon,
  VolumeLowIcon,
  VolumeHighIcon,
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  PictureInPictureIcon,
  PictureInPictureExitIcon,
  FullscreenIcon,
  FullscreenExitIcon,
  SettingsIcon,
  SettingsMenuIcon,
  SeekBackward10Icon,
  SeekForward10Icon,
} from '@vidstack/react/icons';

import './example.css';
import { SpeedSubmenu, AspectRatioSubmenu } from './childs/QualitySubmenu';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { setCurrentEpId, setPlaylist } from '../../../store/slices/EpListSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { movieApi } from '../../../api/movieApi';
import type { WatchEpisodeResponseDto } from '../../../types/episode';

// Định nghĩa Interface Props cho Component
interface PlayerProps {
  watch: WatchEpisodeResponseDto;
}

// 4 biến lớp mã băm thay thế hoàn toàn Tailwind
const buttonClass = 'media-button';
const tooltipClass = 'vds-t-k4m2';

export const VideoLayout: React.FC<PlayerProps> = ({ watch }) => {  
  const player = useMediaPlayer();
  const isPaused = useMediaState('paused');
  const volume = useMediaState('volume');
  const isMuted = useMediaState('muted');
  
  // Trích xuất textTrack ra biến độc lập để kiểm tra an toàn
  const textTrack = useMediaState('textTrack');
  const isCaptionOn = textTrack ? isTrackCaptionKind(textTrack) : false;
  const isPipActive = useMediaState('pictureInPicture');
  const isFullscreenActive = useMediaState('fullscreen');
  const captionOptions = useCaptionOptions();
  const captionHint = captionOptions.selectedTrack?.label ?? 'Tắt';

  const handleShowEpisodes = () => {
    console.log('Mở danh sách tập phim Tiên Nghịch');
  };

  const { episodes, currentEpId } = useAppSelector((state) => state.watch);
  const { movieId, epId } = useParams<{ movieId: string; epId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 1. FIX: Đồng bộ epId từ URL vào Redux khi Route đổi
  useEffect(() => {
    if (epId && epId !== currentEpId) {
      dispatch(setCurrentEpId(epId));
    }
  }, [epId, dispatch]); // Loại bỏ currentEpId khỏi dependency array để tránh loop

  // 2. FIX: Fetch lại danh sách tập nếu Redux trống (F5)
  useEffect(() => {
    const loadEpisodesFromApi = async (id: number) => {
      try {
        const res = await movieApi.getMovieDetail(id);
        const fetchedEpisodes = res.data?.episodes || [];

        if (epId) {
          dispatch(setPlaylist({ episodes: fetchedEpisodes, epId }));
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách tập:', err);
      }
    };

    if (episodes.length === 0 && movieId && epId) {
      loadEpisodesFromApi(Number(movieId));
    }
  }, [movieId, epId, episodes.length, dispatch]);

  // 3. FIX: Thống nhất chuyển đổi tập (ưu tiên id hoặc episodeNumber tuỳ cấu trúc data của bạn)
  const handleSelectEpisode = (selectedEpIdentifier: number | string) => {
    const targetEpStr = String(selectedEpIdentifier);
    dispatch(setCurrentEpId(targetEpStr));
    
    if (movieId) {
      navigate(`/watch/${movieId}/${targetEpStr}`); 
    }
  };

  return (
    <>
      {/* HỆ THỐNG CỬ CHỈ ĐIỀU KHIỂN CHẠM MÀN HÌNH */}
      <Gesture className="vds-g-p8s2" event="pointerup" action="toggle:paused" />
      <Gesture className="vds-g-p8s2" event="dblpointerup" action="toggle:fullscreen" />
      <Gesture className="vds-g-b1m0" event="dblpointerup" action="seek:-10" />
      <Gesture className="vds-g-f4k9" event="dblpointerup" action="seek:10" />

      <input
        type="checkbox"
        id="sidebar-toggle-native"
        className="peer-sidebar hidden"
      />

      <label htmlFor="sidebar-toggle-native" className="sidebar-overlay" />

      <div className="sidebar-panel">
        <div className="sidebar-header">
          <h3 className="sidebar-title">{watch.movieTitle || 'Tiên Nghịch'}</h3>
          <label htmlFor="sidebar-toggle-native" className="sidebar-close-btn">
            ✕
          </label>
        </div>

        <div className="dropdown-container">
          <div className="dropdown-season-wrapper">
            <input
              type="checkbox"
              id="dropdown-season-toggle"
              className="peer-season-toggle"
            />
            <label
              htmlFor="dropdown-season-toggle"
              className="dropdown-season-btn"
            >
              <span className="btn-content">☰ Phần Chính</span>
              <span className="arrow-icon">▼</span>
            </label>
            <div className="dropdown-season-menu">
              <label
                htmlFor="dropdown-season-toggle"
                className="dropdown-season-item-active"
              >
                Phần Chính
              </label>
              <label
                htmlFor="dropdown-season-toggle"
                className="dropdown-season-item"
              >
                Movie Thần Lâm Chi Chiến
              </label>
            </div>
          </div>

          <div className="dropdown-season-wrapper">
            <input
              type="checkbox"
              id="dropdown-sub-toggle"
              className="peer-season-toggle"
            />
            <label htmlFor="dropdown-sub-toggle" className="dropdown-season-btn">
              <span className="btn-content">☰ Việt Sub</span>
              <span className="arrow-icon">▼</span>
            </label>
            <div className="dropdown-season-menu">
              <label
                htmlFor="dropdown-sub-toggle"
                className="dropdown-season-item-active"
              >
                Việt Sub
              </label>
              <label
                htmlFor="dropdown-sub-toggle"
                className="dropdown-season-item"
              >
                4K Việt Sub
              </label>
            </div>
          </div>
        </div>

        {/* DANH SÁCH CÁC TẬP PHIM CUỘN DỌC */}
        <div className="vds-ep-list">
          {episodes.map((ep) => {
            // FIX: Sử dụng thống nhất episodeNumber (hoặc ep.id nếu route của bạn dùng id)
            const targetIdentifier = ep.episodeNumber;
            const isActive = String(targetIdentifier) === String(epId || currentEpId);

            return (
              <div
                key={ep.id}
                onClick={() => handleSelectEpisode(targetIdentifier)}
                className={`ep-item ${
                  isActive ? 'ep-item-active' : 'ep-item-inactive'
                }`}
              >
                <div className="ep-thumbnail-container">
                  <img
                    src="/stickers/tien-nghich-6.jpg"
                    alt={ep.title || `Tập ${ep.episodeNumber}`}
                    className="ep-thumbnail-img"
                  />
                  {isActive && (
                    <div className="ep-play-overlay">
                      <span className="ep-play-icon">▶</span>
                    </div>
                  )}
                </div>
                <span className="vds-ep-text">
                  {ep.title || `Tập ${ep.episodeNumber}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KHUNG ĐIỀU KHIỂN GỐC CỦA PLAYER */}
      <Controls.Root className="vds-c-root">
        {/* THANH TRÊN ĐỈNH CHỨA TIÊU ĐỀ PHIM VÀ NÚT DANH SÁCH TẬP */}
        <div className="vds-t-bar">
          <span className="vds-t-title">
            {`${watch.episodeTitle}`}
          </span>

          <label
            htmlFor="sidebar-toggle-native"
            onClick={handleShowEpisodes}
            className="vds-e-btn"
          >
            <SettingsMenuIcon size={20} />
            Danh sách tập
          </label>
        </div>

        <div className="vds-f-spacer" />

        {/* KHU VỰC THANH ĐIỀU KHIỂN ĐÁY (BOTTOM CONTROLS) */}
        <div className="vds-b-wrapper">
          {/* THANH TUA PHIM */}
          <div className="vds-s-container">
            <TimeSlider.Root className="media-slider vds-t-slider">
              <TimeSlider.Track className="media-slider-track">
                <TimeSlider.TrackFill className="media-slider-track-fill media-slider-track" />
                <TimeSlider.Progress className="media-slider-progress media-slider-track" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="media-slider-thumb" />
              <TimeSlider.Preview className="media-slider-preview" noClamp>
                <TimeSlider.Value className="media-slider-value" />
              </TimeSlider.Preview>
            </TimeSlider.Root>
          </div>

          <div className="vds-b-bar">
            {/* CỤM NÚT CHỨC NĂNG BÊN TRÁI */}
            <div className="vds-g-row">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <PlayButton className="media-button !rounded-full">
                    {isPaused ? (
                      <PlayIcon className="play-icon" />
                    ) : (
                      <PauseIcon className="pause-icon" />
                    )}
                  </PlayButton>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top start">
                  {isPaused ? 'Phát' : 'Tạm dừng'}
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <SeekButton className="media-button !rounded-full" seconds={-10}>
                    <SeekBackward10Icon />
                  </SeekButton>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  Lùi 10s
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <SeekButton className="media-button !rounded-full" seconds={10}>
                    <SeekForward10Icon />
                  </SeekButton>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  Tiến 10s
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <MuteButton className="media-button !rounded-full">
                    <MuteIcon className="mute-icon" />
                    <VolumeLowIcon className="volume-low-icon" />
                    <VolumeHighIcon className="volume-high-icon" />
                  </MuteButton>
                </Tooltip.Trigger>
                <Tooltip.Content className="vds-m-tooltip" placement="top">
                  {isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                </Tooltip.Content>
              </Tooltip.Root>

              <VolumeSlider.Root className="media-slider">
                <VolumeSlider.Track className="media-slider-track">
                  <VolumeSlider.TrackFill className="media-slider-track-fill media-slider-track" />
                </VolumeSlider.Track>
                <VolumeSlider.Preview className="media-slider-preview" noClamp>
                  <VolumeSlider.Value className="media-slider-value" />
                </VolumeSlider.Preview>
                <VolumeSlider.Thumb className="media-slider-thumb" />
              </VolumeSlider.Root>

              <div className="media-time-group">
                <Time className="media-time" type="current" />
                <div className="media-time-divider">/</div>
                <Time className="media-time" type="duration" />
              </div>
            </div>

            {/* CỤM NÚT CHỨC NĂNG BÊN PHẢI */}
            <div className="vds-g-row">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <CaptionButton className={buttonClass}>
                    {isCaptionOn ? (
                      <ClosedCaptionsOnIcon className="vds-i-hash" />
                    ) : (
                      <ClosedCaptionsIcon className="vds-i-hash" />
                    )}
                  </CaptionButton>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  {isCaptionOn ? 'Tắt phụ đề' : 'Bật phụ đề'}
                </Tooltip.Content>
              </Tooltip.Root>

              <Menu.Root>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Menu.Button
                      className="media-button !rounded-full"
                      aria-label="Settings"
                    >
                      <SettingsIcon className="media-rotate-icon" />
                    </Menu.Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content className={tooltipClass} placement="top">
                    Cài đặt
                  </Tooltip.Content>
                </Tooltip.Root>
                <Menu.Items
                  className="media-menu"
                  placement="top"
                  offset={0}
                >
                  <SpeedSubmenu />
                  <AspectRatioSubmenu />
                </Menu.Items>
              </Menu.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <PIPButton className={buttonClass}>
                    {isPipActive ? (
                      <PictureInPictureExitIcon className="vds-i-hash" />
                    ) : (
                      <PictureInPictureIcon className="vds-i-hash" />
                    )}
                  </PIPButton>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  Thu nhỏ
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <FullscreenButton className={buttonClass}>
                    {isFullscreenActive ? (
                      <FullscreenExitIcon className="vds-i-hash" />
                    ) : (
                      <FullscreenIcon className="vds-i-hash" />
                    )}
                  </FullscreenButton>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top end">
                  {isFullscreenActive
                    ? 'Thoát tràn màn hình'
                    : 'Toàn màn hình'}
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          </div>
        </div>
      </Controls.Root>
    </>
  );
};