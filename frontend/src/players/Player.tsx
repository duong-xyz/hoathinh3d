import React, { useEffect, useRef } from 'react';
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type TrackProps,
} from '@vidstack/react';

// Nhập Layout tùy chỉnh của bạn và danh sách phụ đề
import { VideoLayout } from './components/layouta/VideoLayout1';
import example from './components/layouta/example.css?inline';
import sub from './components/layouta/childs/sub.css?inline';
import type { WatchEpisodeResponseDto } from '../types/episode';

interface PlayerProps {
  watch: WatchEpisodeResponseDto;
}

export const Player: React.FC<PlayerProps> = ({watch}) => {  
  // Gán Type chính xác cho useRef của Vidstack MediaPlayer
  const player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    if (!player.current) return;

    // Đăng ký theo dõi trạng thái của trình phát (Ví dụ: pause, play, volume)
    return player.current.subscribe(({ paused, viewType }) => {
      console.log('Đang dừng phát?', paused);
    });
  }, []);

  // Định nghĩa type cho provider trong callback onProviderChange
  const onProviderChange = (provider: MediaProviderAdapter | null) => {
    if (isHLSProvider(provider)) {
      // Cấu hình hls.js nâng cao với đầy đủ Type
      provider.config = {
        maxBufferLength: 30,
        capLevelToPlayerSize: true,
      };
    }
  };

  // Khai báo link linh hoạt: ưu tiên prop truyền vào, nếu không có sẽ lấy link mặc định
  const videoSrc = watch.sources.find((e) => e.sourceType === "HLS")?.sourceURL || 'https://s4.phim1280.tv/20250317/05z7tNIU/index.m3u8';
  const posterSrc = '/stickers/wangling_poster.webp';

  return (
    <>
      <style>{example}</style>
      <style>{sub}</style>
      <MediaPlayer
        part="media-player"
        data-media-player
        className="vds-custom-player"
        title="Sprite Fight"
        src={videoSrc}
        crossOrigin="anonymous" // Cấu hình chuẩn nhận dạng CORS cho phụ đề/ảnh thu nhỏ
        playsInline
        onProviderChange={onProviderChange}
        onCanPlay={() => {
          window.dispatchEvent(
            new CustomEvent('video-loading-state', { detail: { loading: false } })
          );
        }}
        onWaiting={() => {
          window.dispatchEvent(
            new CustomEvent('video-loading-state', { detail: { loading: true } })
          );
        }}
        onPlaying={() => {
          window.dispatchEvent(
            new CustomEvent('video-loading-state', { detail: { loading: false } })
          );
        }}
        onSeeking={() => {
          // Khi người dùng vừa bấm tua thanh thời gian -> BẬT màn hình loading ngay lập tức
          window.dispatchEvent(
            new CustomEvent('video-loading-state', { detail: { loading: true } })
          );
        }}
        onSeeked={() => {
          // Khi phim đã tải xong dữ liệu tại vị trí tua mới -> ẨN màn hình loading đi
          window.dispatchEvent(
            new CustomEvent('video-loading-state', { detail: { loading: false } })
          );
        }}
        ref={player}
      >
        <MediaProvider>
          <Poster
            className="vds-custom-poster"
            src={posterSrc}
            alt="Tiên nghịch poster"
          />
        </MediaProvider>

        {/* Giao diện thanh điều khiển tùy biến từ thư mục cục bộ của bạn */}
        <VideoLayout watch={watch} />

        {/* KHỐI LOADING OVERLAY DÀNH CHO FULL SCREEN TRONG SHADOW DOM */}
        <div className="loading-overlay-fs">
          <style>{`
            /* Khối bọc ngoài */
            .loading-overlay-fs {
              align-items: center;
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: center;
              left: 0;
              position: absolute;
              top: 0;
              width: 100%;
              -webkit-backdrop-filter: blur(3px);
              backdrop-filter: blur(3px);
              background: radial-gradient(ellipse at center, rgba(18, 18, 22, .78) 0, rgba(6, 6, 9, .92) 100%);
              bottom: 0;
              gap: 20px;
              right: 0;
              inset: 0;
              z-index: 2147483647; /* Đè lên mọi lớp Full Screen */
              
              /* Đồng bộ hiệu ứng transition mượt đúng 0.15s theo theme của bạn */
              transition: opacity .15s ease, visibility .15s ease;
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }

            /* MẸO EXPERT: Khi MediaPlayer kích hoạt trạng thái buffering, lập tức HIỆN overlay này lên */
            .vds-custom-player[data-buffering] .loading-overlay-fs,
            :host:has([part="media-player"][data-buffering]) .loading-overlay-fs {
              opacity: 1;
              visibility: visible;
              pointer-events: auto;
            }

            /* Khung hình tròn xoay */
            .loading-overlay-fs .halim-loader {
              display: inline-block;
              height: 68px;
              position: relative;
              width: 68px;
            }

            /* Vòng tròn cam phía ngoài */
            .loading-overlay-fs .halim-loader-ring {
              animation: halim-loader-spin .85s cubic-bezier(.55, .15, .45, .85) infinite;
              border-color: #ff7a00 #ff7a00 hsla(0, 0%, 100%, .1) hsla(0, 0%, 100%, .1);
              border-radius: 50%;
              border-style: solid;
              border-width: 3px;
              bottom: 0; left: 0; right: 0; top: 0; inset: 0;
              position: absolute;
            }

            /* Vòng tròn phụ quay ngược bên trong */
            .loading-overlay-fs .halim-loader-ring:after {
              animation: halim-loader-spin 1.5s linear infinite reverse;
              border-color: transparent transparent rgba(255, 122, 0, .55) rgba(255, 122, 0, .55);
              border-radius: 50%;
              border-style: solid;
              border-width: 3px;
              bottom: 7px; left: 7px; right: 7px; top: 7px; inset: 7px;
              content: "";
              position: absolute;
            }

            /* Lõi tam giác nhấp nháy ở tâm */
            .loading-overlay-fs .halim-loader-core {
              animation: halim-loader-pulse 1.2s ease-in-out infinite;
              border-color: transparent transparent transparent #ff7a00;
              border-style: solid;
              border-width: 8px 0 8px 13px;
              filter: drop-shadow(0 0 6px rgba(255, 122, 0, .5));
              height: 0; left: 50%; top: 50%;
              position: absolute;
              transform: translate(-40%, -50%);
              width: 0;
            }

            /* Chữ chạy hiệu ứng nhấp nháy ánh kim (Shimmer) */
            .loading-overlay-fs .loading-text {
              background: linear-gradient(90deg, hsla(0, 0%, 100%, .45) 25%, #fff 50%, hsla(0, 0%, 100%, .45) 75%);
              -webkit-background-clip: text;
              background-clip: text;
              background-size: 200% 100%;
              color: hsla(0, 0%, 100%, .85);
              font-size: 14px;
              font-weight: 500;
              letter-spacing: .4px;
              margin: 0;
              text-align: center;
              -webkit-text-fill-color: transparent;
              animation: halim-loader-shimmer 1.8s linear infinite;
              font-family: sans-serif;
            }

            /* Hệ thống Animation chạy ngầm */
            @keyframes halim-loader-spin { to { transform: rotate(1turn); } }
            @keyframes halim-loader-pulse {
              0%, 100% { opacity: .55; transform: translate(-40%, -50%) scale(.9); }
              50% { opacity: 1; transform: translate(-40%, -50%) scale(1.08); }
            }
            @keyframes halim-loader-shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            /* Chế độ giảm chuyển động hệ thống */
            @media (prefers-reduced-motion: reduce) {
              .loading-overlay-fs .halim-loader-core,
              .loading-overlay-fs .halim-loader-ring,
              .loading-overlay-fs .halim-loader-ring:after,
              .loading-overlay-fs .loading-text {
                animation-duration: 2s;
              }
            }
          `}</style>

          {/* Khung HTML cấu trúc tròn xoay nguyên bản */}
          <div className="halim-loader" aria-hidden="true">
            <span className="halim-loader-ring" />
            <span className="halim-loader-core" />
          </div>
          <p className="loading-text">Đang tải phim, vui lòng chờ…</p>
        </div>
      </MediaPlayer>
    </>
  );
};