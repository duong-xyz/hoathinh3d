import { useEffect, useMemo, useState } from "react";
import homepageCss from '../assets/homepage.css?inline'
import SearchFullscreenOverlay from "../migration/SearchFullscreenOverlay";
import NavbarCollapse from "../migration/NavbarCollapse";
import CustomLoginModal from "../migration/CustomLoginModal";
import ScheduleTabs from "../migration/ScheduleTabs";
import logofooter from '../assets/logofooter.webp'
import HH3DLatestBox from '../migration/HH3DLatestBox'
import HH3DTrendingTrack from '../migration/HH3DTrendingTrack'
import HH3DWidgetPreview from '../migration/HH3DWidgetPreview'
import Header from "../migration/Header";
import type { MovieResponseDto, Page } from "../types/movie";
import { movieApi } from "../api/movieApi";
import { useLocation, useNavigate } from "react-router-dom";
import { ScheduleUtils, DAYS_CONFIG } from '../utils/scheduleUtil';

function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [noti, setNoti] = useState(false);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState<Page<MovieResponseDto> | null>(null);
  const [activeTab, setActiveTab] = useState<string>("latest");

  const fetchMovies = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await movieApi.getAllMovies(page);
      setMovies(res.data);
      console.log("movie list: ", res.data);
    } catch (err) {
      console.log("Movies list can't be load from server:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(0);    
  }, []);
  const top10Movies = movies?.content ? [...movies.content]
    .sort((a, b) => Number(b.ratingScore || 0) - Number(a.ratingScore || 0)).slice(0, 10) : [];
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // 1. Kiểm tra xem router state có yêu cầu mở modal không
    if (location.state?.openLogin) {
      setIsModalOpen(true);

      // 2. Xóa trạng thái trong router state ngay lập tức 
      // Để tránh việc modal tự động mở lại khi người dùng F5 F5 trang chủ
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const displayedMovies = useMemo(() => {
    if (!movies?.content) return null;

    // 1. Nếu chọn Tab "Mới cập nhật" -> Trả về danh sách gốc
    if (activeTab === "latest") {
      return movies;
    }

    // 2. Tìm cấu hình Bit đại diện cho ngày được chọn (MON, TUE, WED...)
    const targetDayConfig = DAYS_CONFIG.find((day) => day.key === activeTab);
    if (!targetDayConfig) return movies;

    // 3. Thực hiện giải mã Bitmask để lọc phim chiếu trong ngày này (Check cả Chính & Sớm)
    const filteredList = movies.content.filter((movie) => {
      if (!movie.schedule) return false;
      const { normalBitmask, earlyBitmask } = ScheduleUtils.parse(movie.schedule);

      const isNormalMatch = ScheduleUtils.isDaySelected(normalBitmask, targetDayConfig.bit);
      const isEarlyMatch = ScheduleUtils.isDaySelected(earlyBitmask, targetDayConfig.bit);

      return isNormalMatch || isEarlyMatch;
    });

    // Trả về Object bọc lại dạng Page để giữ nguyên Type Props của HH3DLatestBox
    return {
      ...movies,
      content: filteredList,
    };
  }, [movies, activeTab]);
  return (
    <div id="scoped-home-wrapper">
      <style>{homepageCss}</style>
      <div
        id="hh3d-root-wrapper"
        className={`home blog wp-embed-responsive wp-theme-halimmovies wp-child-theme-halimmovies-child halimmovie-version- bm-messages-dark halimmovies ${isMenuOpen ? "hh3d-drawer-open" : ""
          }`}
      >
        <>
          <Header
            setIsMenuOpen={setIsMenuOpen}
            setIsSearchOpen={setIsSearchOpen}
            setIsModalOpen={setIsModalOpen}
            isGenreOpen={isGenreOpen}
            setIsGenreOpen={setIsGenreOpen}
            setNoti={setNoti}
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
              {(SearchFullscreenOverlay as any)({ isOpen: isSearchOpen, onClose: handleCloseSearch })}
              <CustomLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              <div className="col-xs-12 carausel-sliderWidget" />
              <main id="main-contents" className="col-xs-12 col-sm-12 col-md-8">
                <div className="halim-trending-slider">
                  <div className="section-bar clearfix">
                    <h3 className="section-title">

                      <span>
                        <i className="fas fa-fire-alt halim-trending-icon" /> Đang thịnh
                        hành
                      </span>
                    </h3>
                  </div>
                  <div className="halim-trending-container">

                    <button
                      className="halim-trending-nav-button halim-trending-prev-button"
                      aria-label="Previous"
                    >

                      <i className="fas fa-chevron-left" />
                    </button>

                    <HH3DTrendingTrack trendingMovies={top10Movies} />
                    <button
                      className="halim-trending-nav-button halim-trending-next-button"
                      aria-label="Next"
                    >

                      <i className="fas fa-chevron-right" />
                    </button>
                  </div>
                </div>
                <section>
                  <ScheduleTabs
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId)}
                  />
                  <HH3DLatestBox movies={displayedMovies} setMovies={setMovies} isApiLoading={isLoading} />
                </section>
                <HH3DWidgetPreview moviesData={movies} isLoading={isLoading} onRefresh={() => fetchMovies(0)} />
              </main>
            </div>
          </div>
          <div className="clearfix" />
          <footer id="footer" className="clearfix">
            <div className="container footer-columns">
              <div className="row container">
                <div className="widget about col-xs-12 col-sm-4 col-md-4">
                  <div className="footer-logo">

                    <noscript>
                      &lt;img class="img-responsive"
                      src="./logofooter.webp"
                      alt="Hoạt Hình Trung Quốc - Xem Hoạt Hình 3D Hay | HH3D"/&gt;
                    </noscript>
                    <img
                      src={logofooter}
                      className="lazyload img-responsive"
                      data-src={logofooter}
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
          <div id="um_upload_single" style={{ display: "none" }} />
          <div id="um_view_photo" style={{ display: "none" }}>

            <a
              href="javascript:void(0);"
              data-action="um_remove_modal"
              className="um-modal-close"
              aria-label="Close view photo modal"
            >

              <i className="um-faicon-times" />
            </a>
            <div className="um-modal-body photo">
              <div className="um-modal-photo" />
            </div>
          </div>
          <noscript>
            &lt;style&gt;.lazyload{"{"}display:none{"}"}&lt;/style&gt;
          </noscript>
          <NavbarCollapse
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isGenreOpen={isGenreOpen}
            setIsGenreOpen={setIsGenreOpen}
          />
          <div id="noti-backdrop" aria-hidden="true" className={noti ? "is-visible" : ""} style={{ display: noti ? 'block' : 'none' }} />
          <div
            id="dropdown-noti"
            className={`noti-drawer dropdown-menu-fb noti-dropdown bg-dark ${noti && "show"}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="noti-drawer-title"
            aria-hidden={noti ? "false" : "true"}
          >
            <div className="notification-header">
              <div className="notification-header__title">
                {" "}
                <span className="notification-header__icon" aria-hidden="true">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22a1.75 1.75 0 0 0 1.73-1.5h-3.46A1.75 1.75 0 0 0 12 22Zm7-4.5v-4.86c0-3.14-2.11-5.78-5-6.64V5.5a1.5 1.5 0 1 0-3 0v.5C8.11 6.86 6 9.5 6 12.64V17.5L4 19.5v.5h16v-.5l-1-2Z"
                      fill="currentColor"
                    />
                  </svg>{" "}
                </span>{" "}
                <span className="notification-title" id="noti-drawer-title">
                  Thông báo
                </span>
              </div>
              <div className="notification-header__actions">
                <a href="/thong-bao" className="notification-view-all">
                  Xem tất cả
                </a>
                <button
                  type="button"
                  className="noti-drawer-close"
                  id="noti-drawer-close"
                  aria-label="Đóng thông báo"
                  onClick={() => setNoti(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {" "}
                    <path
                      d="M6.4 6.4a1 1 0 0 1 1.4 0L12 10.6l4.2-4.2a1 1 0 1 1 1.4 1.4L13.4 12l4.2 4.2a1 1 0 1 1-1.4 1.4L12 13.4l-4.2 4.2a1 1 0 1 1-1.4-1.4L10.6 12 6.4 7.8a1 1 0 0 1 0-1.4Z"
                      fill="currentColor"
                    />{" "}
                  </svg>{" "}
                </button>
              </div>
            </div>
            <div
              className="noti-drawer__scroll"
              id="noti-drawer-scroll"
              aria-busy="false"
              style={{ overflowY: "auto" }}
            >
              <div id="list-item-notification" className="notification-list">
                <div className="notification-section-title-notify">Trước đó</div>
                <div className="notification-item-notify notification-unread-notify">
                  <a
                    href="/xem-phim-tien-nghich/tap-152-sv1.html"
                    className="notification-link-notify"
                  >
                    <div className="notification-avatar-notify">
                      <img src="/wp-content/uploads/2023/09/tien-nghich-6.jpg" alt="" />
                      <div className="notification-icon-notify icon-movie-notify">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width={10}
                          height={10}
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="notification-content-notify">
                      <div className="notification-text-notify">
                        <span className="fb-noti-name-notify">Tiên Nghịch</span>
                        <span>đã phát sóng Tập 152</span>
                      </div>
                      <div className="notification-time-notify">2 ngày trước</div>
                    </div>
                  </a>
                  <div className="notification-delete-notify" data-id={38889436}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1={10} y1={11} x2={10} y2={17} />
                      <line x1={14} y1={11} x2={14} y2={17} />
                    </svg>
                  </div>
                  <div className="delete-confirm-notify">
                    <div className="delete-confirm-overlay-notify" />
                    <div className="delete-confirm-content-notify">
                      <button className="delete-confirm-cancel-notify">Hủy</button>
                      <button className="delete-confirm-ok-notify">Xóa</button>
                    </div>
                  </div>

                </div>
                <div className="notification-item-notify notification-unread-notify">
                  <a
                    href="/xem-phim-pham-nhan-tu-tien-phan-3/tap-185-sv1.html"
                    className="notification-link-notify"
                  >
                    <div className="notification-avatar-notify">
                      <img
                        src="/wp-content/uploads/2026/06/pham-nhan-tu-tien-phan-3-thumb.jpg"
                        alt=""
                      />
                      <div className="notification-icon-notify icon-movie-notify">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width={10}
                          height={10}
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="notification-content-notify">
                      <div className="notification-text-notify">
                        <span className="fb-noti-name-notify">
                          Phàm Nhân Tu Tiên Phần 3
                        </span>
                        <span>đã phát sóng Tập 185</span>
                      </div>
                      <div className="notification-time-notify">3 ngày trước</div>
                    </div>
                  </a>
                  <div className="notification-delete-notify" data-id={38784769}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1={10} y1={11} x2={10} y2={17} />
                      <line x1={14} y1={11} x2={14} y2={17} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="badge-settings-float-button" onClick={() => navigate("/admin")}><i className="fas fa-cog"></i></div> */}
        </>

      </div>
    </div>
  );
}

export default Home;
