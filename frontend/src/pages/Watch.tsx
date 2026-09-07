
import { useEffect, useRef, useState } from 'react';
import Header from '../migration/Header';
import SearchFullscreenOverlay from '../migration/SearchFullscreenOverlay';
import CustomLoginModal from '../migration/CustomLoginModal';
import MovieWatchPanel from '../migration/MovieWatchPanel';
// import TuTienComments from '../components/TuTienComments1'
import { Player } from '../players/Player'
import watchStyles from '../../public/css/watch.css?raw'
import { useAppDispatch, useAppSelector } from '../store/store';
import { movieApi } from '../api/movieApi';
import { Link, useParams } from 'react-router-dom';
import { setCurrentEpId, setPlaylist } from '../store/slices/EpListSlice';
import { episodeApi } from '../api/episodeApi';
import type { WatchEpisodeResponseDto } from '../types/episode';
// import { HotkeyTooltip } from '../components/HotkeyTooltip';
// import VipOverlay from '../components/VipOverlay';
// import Sticker from '../components/Sticker';
// import ReactionPicker from '../components/ReactionPicker';

export default function Watch() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGenreOpen, setIsGenreOpen] = useState(false);

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };

    const hostRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleLoadingEvent = (e: any) => {
            const host = hostRef.current;
            console.log("host:", host);

            if (!host) return;

            if (e.detail.loading) {
                host.classList.add('is-loading');
            } else {
                host.classList.remove('is-loading');
            }
        };

        // Lắng nghe sự kiện từ bên trong Shadow DOM bắn ra window
        window.addEventListener('video-loading-state', handleLoadingEvent);

        return () => {
            window.removeEventListener('video-loading-state', handleLoadingEvent);
        };
    }, []);

    const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
        const targetEl = document.getElementById("halimControlsMoreSheet");
        if (!targetEl) return;

        const buttonEl = e.currentTarget as HTMLElement;
        const willOpen = !targetEl.classList.contains("is-open");

        if (willOpen) {
            if (window.innerWidth >= 1100 && buttonEl) {
                const rect = buttonEl.getBoundingClientRect();

                // 1. Lấy chiều cao của popup (nếu chưa render thì lấy tạm ước tính 200px)
                const popupHeight = targetEl.offsetHeight || 200;

                // 2. Tính khoảng trống còn lại phía dưới nút bấm
                const spaceBelow = window.innerHeight - rect.bottom;

                // 3. Căn mép PHẢI thẳng hàng với nút "Khác"
                const rightOffset = window.innerWidth - rect.right;

                // 4. Kiểm tra: Nếu khoảng trống dưới KHÔNG ĐỦ cho popup (và phía trên đủ chỗ hơn)
                if (spaceBelow < popupHeight + 10) {
                    // --- NẮM Ở TRÊN (FLIP UP) ---
                    const bottomOffset = window.innerHeight - rect.top + 8; // Cách mép trên nút 8px

                    targetEl.style.cssText = `
            position: fixed;
            inset: auto ${rightOffset}px ${bottomOffset}px auto !important;
            width: 300px !important;
            align-items: flex-start !important;
        `;
                } else {
                    // --- NẰM Ở DƯỚI (FLIP DOWN - MẶC ĐỊNH) ---
                    const topOffset = rect.bottom + 8; // Cách mép dưới nút 8px

                    targetEl.style.cssText = `
            position: fixed;
            inset: ${topOffset}px ${rightOffset}px auto auto !important;
            width: 300px !important;
            align-items: flex-start !important;
        `;
                }
            } else {
                targetEl.removeAttribute("style");
            }
        } else {
            targetEl.removeAttribute("style");
        }

        targetEl.classList.toggle("is-open");
    };

    const [isOpen, setIsOpen] = useState(false);
    const [onSelectStickerCallback, setOnSelectStickerCallback] = useState(null);
    const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null); // Lưu { top, left }
    const [isReaction, setIsReaction] = useState(false);
    const [cmtId, setCmtId] = useState(null);
    const handleOpenPopup = (rect: any, cmtId: any) => {
        const POPUP_WIDTH = 220;
        const POPUP_HEIGHT = 45;
        const GAP = 15;
        const PADDING = 10;
        const win = window;
        const docEl = document.documentElement;
        const viewportWidth = docEl.clientWidth || win.innerWidth;
        const scrollX = win.scrollX || win.pageXOffset;
        const scrollY = win.scrollY || win.pageYOffset;
        const showOnTop = rect.top >= (POPUP_HEIGHT + GAP + PADDING);
        const absoluteTop = showOnTop
            ? rect.top + scrollY - POPUP_HEIGHT - GAP
            : rect.bottom + scrollY + GAP;

        let absoluteLeft = rect.left + scrollX + (rect.width / 2) - (POPUP_WIDTH / 2);
        absoluteLeft = Math.max(scrollX + PADDING, Math.min(absoluteLeft, scrollX + viewportWidth - POPUP_WIDTH - PADDING));
        setPopupPos({ top: absoluteTop, left: absoluteLeft });
        setIsReaction(true);
        setCmtId(cmtId);
        const DYNAMIC_HITBOX_ID = 'wv-picker-hitbox-style';
        if (!document.getElementById(DYNAMIC_HITBOX_ID)) {
            const styleTag = document.createElement('style');
            styleTag.id = DYNAMIC_HITBOX_ID;
            styleTag.textContent = `
            .wv-reaction-picker { position: absolute !important; }
            .wv-reaction-picker::after {
                content: "" !important;
                position: absolute !important;
                left: -15px !important;
                right: -15px !important;
                height: var(--hitbox-height, 30px) !important;
                background: transparent !important;
                pointer-events: auto !important;
                z-index: -1 !important;
            }
            .wv-reaction-picker[data-top="true"]::after { 
                top: 100% !important; 
                bottom: auto !important;
            }
            .wv-reaction-picker[data-top="false"]::after { 
                bottom: 100% !important; 
                top: auto !important;
            }
        `;
            document.head.appendChild(styleTag);
        }
        const setupPopupNode = (attempts = 0) => {
            const popupEls = document.querySelectorAll('.wv-reaction-picker');
            const popupEl = popupEls[popupEls.length - 1] as HTMLElement;
            if (!popupEl) {
                if (attempts < 3) {
                    requestAnimationFrame(() => setupPopupNode(attempts + 1));
                }
                return;
            }
            popupEl.dataset.top = String(showOnTop);
            popupEl.style.setProperty('--hitbox-height', `${GAP + 15}px`);
            popupEl.onmouseleave = () => setIsReaction(false);
        };
        requestAnimationFrame(() => setupPopupNode());
    };
    const handleClosePopup = () => {
        setIsReaction(false);
    };
    const addVotesRef = useRef(null);

    const { movieId, epId } = useParams<{ movieId: string; epId: string }>();
    const [watch, setWatch] = useState<WatchEpisodeResponseDto | null>(null);
    const fetchMovie = async () => {
        try {
            const res = await episodeApi.getWatchData(+movieId!, +epId!);
            setWatch(res.data);
        } catch (err) { }
    }
    useEffect(() => {
        fetchMovie();
    }, [movieId, epId]);
    const { episodes, currentEpId } = useAppSelector((state) => state.watch);
    const dispatch = useAppDispatch();
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
        else if (epId && epId !== currentEpId) {
            dispatch(setCurrentEpId(epId));
        }
    }, [movieId, epId, episodes.length, currentEpId, dispatch]);
    const handleChangeEp = (newEpId: string) => {
        dispatch(setCurrentEpId(newEpId));
    };
    return (
        <div id="scoped-home-wrapper">
            <style>{watchStyles}</style>
            <div id="hh3d-root-wrapper">
                <Header
                    setIsMenuOpen={setIsMenuOpen}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsModalOpen={setIsModalOpen}
                    isGenreOpen={isGenreOpen}
                    setIsGenreOpen={setIsGenreOpen}
                />
                <div className="container">
                    <div className="row fullwith-slider" />
                </div>
                <div className="container-fluid halim-full-player hidden halim-centered">
                    <div
                        id="halim-full-player"
                        className="container col-md-offset-2s col-md-8"
                    />
                </div>
                <div className="container">
                    <div className="row container" id="wrapper">
                        <div className="halim-panel-filter">
                            <div className="row" />
                            <div
                                id="ajax-filter"
                                className="panel-collapse collapse"
                                aria-expanded="true"
                                role="menu"
                            >
                                <div className="ajax" />
                            </div>
                        </div>
                        <SearchFullscreenOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} />
                        <CustomLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                        <div
                            id="halim-player-wrapper"
                            className="ajax-player-loading halim-engine-playerjs"
                        >
                            <div ref={hostRef} id="ajax-player-hh3d" className="halim-playerjs-host">
                                <div className="halim-player-aspect">
                                    <div className="playerjs-mount-slot">
                                        {watch && <Player watch={watch} />}
                                    </div>
                                </div>
                                <div className="loading-overlay ">
                                    <div className="halim-loader" aria-hidden="true">

                                        <span className="halim-loader-ring" />
                                        <span className="halim-loader-core" />
                                    </div>
                                    <p className="loading-text">Đang tải phim, vui lòng chờ…</p>
                                </div>
                                <div
                                    id="custom-info-overlay"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        color: "rgb(255, 255, 255)",
                                        display: "none",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5em",
                                        zIndex: 10002
                                    }}
                                    className={false ? "is-visible" : ""}
                                    aria-hidden="true"
                                >
                                    Đang chuyển tập...
                                </div>
                                {/* <VipOverlay hasVip={false} /> */}

                            </div>
                            <div className="halim-player-controls">
                                <div className="halim-controls-left">

                                    <button
                                        className={`halim-control-btn halim-favorite-btn ${true && "active"}`}
                                        id="bookmark3"
                                        data-action="follow"
                                        data-post_id={902626}
                                    >

                                        {false && <i className="far fa-heart" />}
                                        <i className="fas fa-heart" />
                                        <span>Theo dõi</span>
                                    </button>
                                    <button
                                        className="halim-control-btn halim-player-rate-btn"
                                        data-post-id={902626}
                                        data-post-title="Trảm Thần: Phàm Trần Thần Vực Phần 2"
                                        data-current-rating="4.5"
                                        data-total-votes={600}
                                    >

                                        <i className="fas fa-star" /> <span>Đánh giá</span>
                                    </button>
                                    <span
                                        className="halim-controls-divider halim-controls-divider--group halim-controls-divider--after-social"
                                        aria-hidden="true"
                                    />
                                    {/* <HotkeyTooltip>
                                        <button
                                            className="halim-control-btn halim-prev-episode"
                                            data-tooltip-hotkey="Phím tắt: L"
                                        >

                                            <span
                                                className="halim-ep-icon halim-ep-icon--prev"
                                                aria-hidden="true"
                                            />
                                            <span>Trước</span>
                                        </button>
                                    </HotkeyTooltip>
                                    <HotkeyTooltip>
                                        <button
                                            className="halim-control-btn halim-next-episode"
                                            data-tooltip-hotkey="Phím tắt: T"
                                        >

                                            <span
                                                className="halim-ep-icon halim-ep-icon--next"
                                                aria-hidden="true"
                                            />
                                            <span>Tiếp</span>
                                        </button>
                                    </HotkeyTooltip> */}
                                    <span
                                        className="halim-controls-divider halim-controls-divider--group halim-controls-divider--after-nav"
                                        aria-hidden="true"
                                    />
                                    <button
                                        type="button"
                                        className="halim-control-btn halim-toggle-light halim-controls-bar-extra"
                                        id="toggle-light"
                                        title="Tắt đèn — phím D"
                                        aria-label="Tắt đèn"
                                        aria-pressed="false"
                                    >

                                        <i className="hl-adjust" aria-hidden="true" />
                                        <span className="halim-toggle-light-label">Đèn</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="halim-control-btn halim-web-fullscreen-btn halim-controls-bar-extra"
                                        id="halimWebFullscreenBtn"
                                        title="Bật/tắt chế độ rạp phim"
                                        aria-label="Rạp phim"
                                        aria-pressed="false"
                                    >
                                        <i className="fas fa-film" aria-hidden="true" />
                                        <span className="halim-web-fullscreen-label">Rạp phim</span>
                                    </button>
                                    <span
                                        className="halim-controls-divider halim-controls-divider--group halim-controls-divider--before-more"
                                        aria-hidden="true"
                                    />
                                    <div className="halim-controls-more-wrap">
                                        <button
                                            type="button"
                                            className={`halim-control-btn halim-controls-more-btn ${false && "is-open"}`}
                                            id="halimControlsMoreBtn"
                                            aria-expanded="true"
                                            aria-controls="halimControlsMoreSheet"
                                            aria-haspopup="dialog"
                                            title="Thêm tùy chọn"
                                            aria-label="Tùy chọn khác"
                                            onClick={handleClickOption}
                                        >
                                            <i
                                                className="fas fa-ellipsis-h"
                                                aria-hidden="true"
                                            /> <span>Khác</span>
                                        </button>
                                        <div
                                            className={`halim-controls-more-sheet ${false && "is-open"}`}
                                            id="halimControlsMoreSheet"
                                            aria-hidden="false"
                                        >
                                            <div
                                                className="halim-controls-more-backdrop"
                                                data-close-sheet=""
                                                tabIndex={-1}
                                                aria-hidden="true"
                                            />
                                            <div
                                                className="halim-controls-more-panel"
                                                role="dialog"
                                                aria-modal="true"
                                                aria-labelledby="halimControlsMoreTitle"
                                            >
                                                <div className="halim-controls-more-header">
                                                    <h3 id="halimControlsMoreTitle">Khác</h3>
                                                    <button
                                                        type="button"
                                                        className="halim-controls-more-close"
                                                        data-close-sheet=""
                                                        aria-label="Đóng"
                                                        onClick={handleClickOption}
                                                    >

                                                        <i className="fas fa-times" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <div className="halim-controls-more-body">

                                                    <button
                                                        type="button"
                                                        className="halim-controls-more-row toggle-basic-btn is-on active"
                                                        id="autoNextToggleBtn"
                                                        aria-pressed="true"
                                                        aria-label="Tắt chuyển tập tự động"
                                                        title="Tắt chuyển tập tự động"
                                                    >

                                                        <span className="halim-controls-more-row-icon" aria-hidden="true">
                                                            <i className="fas fa-sliders-h" />
                                                        </span>
                                                        <span className="halim-controls-more-row-label auto-next-text">
                                                            Chuyển tập
                                                        </span>
                                                        <span className="halim-controls-more-row-action">
                                                            <span
                                                                className="toggle-basic"
                                                                style={{
                                                                    opacity: 1,
                                                                    borderColor: "var(--primary-color, #ff7a00)"
                                                                }}
                                                            >
                                                                ON
                                                            </span>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="halim-controls-more-row toggle-basic-btn is-on active"
                                                        id="autoSkipIntroToggleBtn"
                                                        aria-pressed="true"
                                                        aria-label="Tắt bỏ qua giới thiệu"
                                                        title="Tắt bỏ qua giới thiệu"
                                                    >

                                                        <span className="halim-controls-more-row-icon" aria-hidden="true">
                                                            <i className="fas fa-info-circle" />
                                                        </span>
                                                        <span className="halim-controls-more-row-label auto-skip-text">
                                                            Giới thiệu
                                                        </span>
                                                        <span className="halim-controls-more-row-action">
                                                            <span
                                                                className="toggle-basic"
                                                                style={{
                                                                    opacity: 1,
                                                                    borderColor: "var(--primary-color, #ff7a00)"
                                                                }}
                                                            >
                                                                ON
                                                            </span>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="halim-controls-more-row halim-controls-more-row--action halim-toggle-light halim-toggle-light--mirror halim-controls-sheet-extra"
                                                        title="Tắt đèn — phím D"
                                                        aria-label="Đèn"
                                                        aria-pressed="false"
                                                    >

                                                        <span className="halim-controls-more-row-icon" aria-hidden="true">
                                                            <i className="hl-adjust" />
                                                        </span>
                                                        <span className="halim-controls-more-row-label halim-toggle-light-label">
                                                            Đèn
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div id="halim-ajax-list-server-slot" />
                        <div className="clearfix" />
                        <div className="collapse" id="moretool">
                            <div className="nav nav-pills x-nav-justified">
                                <div
                                    className="fb-like"
                                    data-href="https://hoathinh3d.st/tram-than-pham-tran-than-vuc-phan-2/"
                                    data-layout="button_count"
                                    data-action="like"
                                    data-size="small"
                                    data-show-faces="true"
                                    data-share="true"
                                />
                                <div
                                    className="fb-save"
                                    data-uri="https://hoathinh3d.st/tram-than-pham-tran-than-vuc-phan-2/"
                                    data-size="small"
                                />
                            </div>
                        </div>
                        <main id="main-contents" className="col-xs-12 col-sm-12 col-md-8">
                            <section id="content">
                                <div className="clearfix wrap-content">
                                    <div className="clearfix" />
                                    <div className="clearfix" />
                                    <div className="clearfix" />
                                    <div className="clearfix" />
                                    <MovieWatchPanel initialEpisodes={episodes} movieId={movieId!} epId={epId!}/>

                                    <section
                                        className="title-block watch-page watch-page-v2 ah-frame-bg"
                                        aria-label="Thông tin phim đang xem"
                                    >
                                        <div className="watch-page-v2__inner">
                                            <div className="watch-page-v2__main">
                                                <p className="watch-page-v2__title">
                                                    {watch && watch.movieTitle}
                                                </p>
                                                <Link
                                                    to={`/detail/${movieId}`}
                                                    className="watch-page-v2__info-link"
                                                    title="Xem nội dung phim trên trang thông tin"
                                                >

                                                    <i className="fa fa-info-circle" aria-hidden="true" />
                                                    <span>Xem thông tin phim</span>
                                                </Link>
                                            </div>
                                            <div className="watch-page-v2__rating-col">
                                                <div className="halim-rating-container">
                                                    <div className="halim-star-rating">

                                                        <i
                                                            className="fas fa-star halim-star-icon"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="halim-rating-score">4.5</span>
                                                        <span className="halim-rating-slash">/</span>
                                                        <span className="halim-rating-max">5</span>
                                                        <span className="halim-rating-votes">(600 lượt)</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="halim-rating-button"
                                                        data-post-id={902626}
                                                        data-rating="4.5"
                                                        data-votes={600}
                                                        data-title="Trảm Thần: Phàm Trần Thần Vực Phần 2"
                                                    >
                                                        <i className="fas fa-star" aria-hidden="true" />
                                                        <span>Đánh giá</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <div className="clearfix" />

                                    {/* <TuTienComments setIsOpen={setIsOpen}
                                        setOnSelectStickerCallback={setOnSelectStickerCallback}
                                        onOpenPopup={handleOpenPopup}
                                        onClosePopup={handleClosePopup}
                                        onInit={(fn) => (addVotesRef.current = fn)}
                                    /> */}
                                    <div id="lightout" />
                                </div>
                            </section>
                            <section className="related-movies" />
                            <div id="the_tag_list" className="the_tag_list item-tags">
                                <a
                                    href="#"
                                    title={watch?.movieTitle}
                                    rel="tag"
                                    onClick={e => e.preventDefault()}
                                >
                                    {watch?.movieTitle}
                                </a>
                            </div>
                            <div className="item-tags-toggle" style={{ display: "none" }}>
                                <div className="item-tags-gradient" />
                                <span
                                    className="show-more-tags"
                                    data-single="true"
                                    data-showmore="Xem thêm..."
                                    data-showless="Ẩn đi..."
                                >
                                    Xem thêm...
                                </span>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="clearfix" />
                <footer id="footer" className="clearfix">
                    <div className="container footer-columns">
                        <div className="row container">
                            <div className="widget about col-xs-12 col-sm-4 col-md-4">
                                <div className="footer-logo">

                                    <img
                                        className="img-responsive"
                                        src="https://hoathinh3d.st/wp-content/uploads/2026/06/logofooter.webp"
                                        alt="Hoạt Hình Trung Quốc - Xem Hoạt Hình 3D Hay | HH3D"
                                    />
                                    <span className="social"> </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="footer-credit">
                    <div className="container credit">
                        <div className="row container">
                            <div className="col-xs-12 col-sm-4 col-md-6">

                                ©
                                <a
                                    id="halimthemes"
                                    href="https://hoathinh3d.st/"
                                    title="Copyright ® 2025 HOATHINH3D."
                                >
                                    Copyright ® 2025 HOATHINH3D.
                                </a>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-6 text-right pull-right">
                                <p className="blog-info">

                                    <a
                                        href="https://hoathinh3d.st/sitemap_index.xml"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        Sitemap
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {false && (<div className="movie-rating-modal-overlay" id="ratingModal">
                    <div className="movie-rating-modal">
                        <div className="movie-rating-modal-header">
                            <button className="movie-rating-modal-close" id="closeModalBtn">
                                ✕
                            </button>
                            <h2 className="movie-rating-movie-title">
                                Trảm Thần: Phàm Trần Thần Vực Phần 2
                            </h2>
                            <div className="movie-rating-movie-rating">
                                <span className="movie-rating-rating-icon">★</span>
                                <span>4.5/5 (600 lượt đánh giá)</span>
                            </div>
                        </div>
                        <div className="movie-rating-modal-body">
                            <h3 className="movie-rating-rating-title">
                                Bạn đánh giá phim này thế nào?
                            </h3>
                            <div className="movie-rating-rating-options" id="ratingOptions">
                                <div className="movie-rating-rating-option" data-value={5}>
                                    <img
                                        src="/wp-content/themes/halimmovies-child/assets/image/rate/rate-5.webp"
                                        alt="Đỉnh nóc"
                                    />
                                    <span className="movie-rating-rating-option-text">Đỉnh nóc</span>
                                </div>
                                <div className="movie-rating-rating-option" data-value={4}>
                                    <img
                                        src="/wp-content/themes/halimmovies-child/assets/image/rate/rate-4.webp"
                                        alt="Hay ho"
                                    />
                                    <span className="movie-rating-rating-option-text">Hay ho</span>
                                </div>
                                <div className="movie-rating-rating-option" data-value={3}>
                                    <img
                                        src="/wp-content/themes/halimmovies-child/assets/image/rate/rate-3.webp"
                                        alt="Tạm ổn"
                                    />
                                    <span className="movie-rating-rating-option-text">Tạm ổn</span>
                                </div>
                                <div className="movie-rating-rating-option" data-value={2}>
                                    <img
                                        src="/wp-content/themes/halimmovies-child/assets/image/rate/rate-2.webp"
                                        alt="Nhạt nhòa"
                                    />
                                    <span className="movie-rating-rating-option-text">Nhạt nhòa</span>
                                </div>
                                <div className="movie-rating-rating-option" data-value={1}>
                                    <img
                                        src="/wp-content/themes/halimmovies-child/assets/image/rate/rate-1.webp"
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
                            >
                                Gửi đánh giá
                            </button>
                            <button
                                className="movie-rating-btn movie-rating-btn-secondary"
                                id="cancelBtn"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>)}

                {/* <Sticker isOpen={isOpen} setIsOpen={setIsOpen}
                    onSelectSticker={(sticker) => {
                        if (typeof onSelectStickerCallback === 'function') {
                            onSelectStickerCallback(sticker);
                        }
                    }}
                /> */}
                {/* <ReactionPicker isReaction={isReaction} popupPos={popupPos} setIsReaction={setIsReaction} activeCommentId={cmtId} onSelectReaction={(reaction, id) => addVotesRef.current?.(reaction, id)} /> */}
            </div>
        </div>

    );
}