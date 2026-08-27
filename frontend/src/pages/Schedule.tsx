import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../migration/Header';
import SearchFullscreenOverlay from '../migration/SearchFullscreenOverlay';
import CustomLoginModal from '../migration/CustomLoginModal';
import { movieApi } from '../api/movieApi';
import type { MovieResponseDto } from '../types/movie';
import styles from '../../public/css/schedule.css?raw';

interface DayOfWeek {
    id: string;
    label: string;
    apiParam: string;
}

export default function Schedule() {
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [, setIsMenuOpen] = useState<boolean>(false);
    const [isGenreOpen, setIsGenreOpen] = useState<boolean>(false);

    const [normalMovies, setNormalMovies] = useState<MovieResponseDto[]>([]);
    const [earlyMovies, setEarlyMovies] = useState<MovieResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const daysOfWeek: DayOfWeek[] = [
        { id: "thu-hai", label: "Thứ Hai", apiParam: "2" },
        { id: "thu-ba", label: "Thứ Ba", apiParam: "3" },
        { id: "thu-tu", label: "Thứ Tư", apiParam: "4" },
        { id: "thu-nam", label: "Thứ Năm", apiParam: "5" },
        { id: "thu-sau", label: "Thứ Sáu", apiParam: "6" },
        { id: "thu-bay", label: "Thứ Bảy", apiParam: "7" },
        { id: "chu-nhat", label: "Chủ Nhật", apiParam: "CN" },
    ];

    const [selectedDay, setSelectedDay] = useState<DayOfWeek>(daysOfWeek[1]); // Mặc định Thứ 3

    // Tự động chọn ngày hôm nay khi component mount
    useEffect(() => {
        const currentDayIndex = new Date().getDay(); // 0: CN, 1: T2, 2: T3,...
        const dayMapIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
        const today = daysOfWeek[dayMapIndex];
        setSelectedDay(today);
        fetchSchedule(today.apiParam);
    }, []);

    // Call API lấy lịch chiếu
    const fetchSchedule = async (apiParam: string) => {
        setLoading(true);
        try {
            const res = await movieApi.getScheduleByDay(apiParam);
            setNormalMovies(res.data.normalMovies || []);
            setEarlyMovies(res.data.earlyMovies || []);
        } catch (error) {
            console.error("Lỗi khi tải lịch chiếu:", error);
            setNormalMovies([]);
            setEarlyMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDay = (day: DayOfWeek) => {
        setSelectedDay(day);
        fetchSchedule(day.apiParam);
    };

    // Helper bóc tách giờ chiếu từ chuỗi schedule (Ví dụ: "18:00|1|0" -> "18:00")
    const parseBroadcastTime = (scheduleStr?: string): string => {
        if (!scheduleStr || !scheduleStr.includes('|')) return '--:--';
        return scheduleStr.split('|')[0] || '--:--';
    };

    return (
        <>
            <style>{styles}</style>
            <div id="hh3d-root-wrapper">
                <Header
                    setIsMenuOpen={setIsMenuOpen}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsModalOpen={setIsModalOpen}
                    isGenreOpen={isGenreOpen}
                    setIsGenreOpen={setIsGenreOpen}
                />
                
                <SearchFullscreenOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <CustomLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                <div className="container">
                    <div className="row container" id="wrapper">
                        <div className="lc-schedule-page">
                            <div className="lc-bg" aria-hidden="true" />
                            <div className="lc-overlay" aria-hidden="true" />
                            <div className="lc-inner">
                                <header className="lc-title-wrap">
                                    <div className="lc-title-divider" aria-hidden="true" />
                                    <h1 className="lc-page-title">
                                        <i className="fas fa-film" aria-hidden="true" /> Lịch Chiếu HoatHinh3D
                                    </h1>
                                    <p className="lc-title-sub">
                                        Xem lịch chiếu phim hoạt hình trung quốc đang chiếu trong tuần.
                                    </p>
                                </header>

                                {/* Day Tabs Navigation */}
                                <nav className="lc-day-tabs" id="dayTabs" aria-label="Chọn ngày trong tuần">
                                    {daysOfWeek.map((day) => (
                                        <button
                                            key={day.id}
                                            type="button"
                                            className={`lc-day-tab ${selectedDay.id === day.id ? 'active' : ''}`}
                                            onClick={() => handleSelectDay(day)}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </nav>

                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#fff' }}>
                                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                                        <p style={{ marginTop: '10px' }}>Đang tải lịch chiếu...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Phim Chiếu Sớm */}
                                        {earlyMovies.length > 0 && (
                                            <section className="lc-early-schedule active" aria-label="Phim chiếu sớm">
                                                <div className="lc-section-head">
                                                    <i className="fas fa-sun" aria-hidden="true" />
                                                    <span>Phim Chiếu Sớm</span>
                                                    <div className="lc-head-line" />
                                                </div>
                                                <div className="lc-schedule-items" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                                    {earlyMovies.map((movie) => (
                                                        <Link key={movie.id} to={`/movies/${movie.id}`} className="lc-schedule-item">
                                                            <img
                                                                src={movie.thumbnailUrl || '/placeholder.png'}
                                                                alt={movie.title}
                                                                loading="lazy"
                                                                width={64}
                                                                height={90}
                                                            />
                                                            <div className="lc-schedule-info">
                                                                <h3 className="lc-schedule-title">{movie.title}</h3>
                                                                <div className="lc-schedule-meta">
                                                                    <div className="lc-schedule-episode">
                                                                        <i className="fas fa-star" aria-hidden="true" /> {movie.ratingScore ? `${movie.ratingScore}/10` : 'Đang cập nhật'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="lc-early-time">{parseBroadcastTime(movie.schedule)}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Lịch Chiếu Chính (Chính Thức) */}
                                        <section className="lc-grid-wrapper">
                                            <div className="lc-section-head jade-head">
                                                <i className="fas fa-calendar-alt" aria-hidden="true" />
                                                <span>Lịch Chiếu {selectedDay.label}</span>
                                                <div className="lc-head-line" />
                                            </div>

                                            {normalMovies.length > 0 ? (
                                                <div className="lc-schedule-grid" id="scheduleGrid">
                                                    {normalMovies.map((movie) => (
                                                        <Link key={movie.id} to={`/movies/${movie.id}`} className="lc-schedule-item">
                                                            <img
                                                                src={movie.thumbnailUrl || '/placeholder.png'}
                                                                alt={movie.title}
                                                                loading="lazy"
                                                                width={64}
                                                                height={90}
                                                            />
                                                            <div className="lc-schedule-info">
                                                                <h3 className="lc-schedule-title">{movie.title}</h3>
                                                                <div className="lc-schedule-meta">
                                                                    <div className="lc-schedule-episode">
                                                                        <i className="fas fa-clock" aria-hidden="true" /> Giờ chiếu: {parseBroadcastTime(movie.schedule)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ color: '#aaa', padding: '20px 0' }}>
                                                    Không có phim nào chiếu vào {selectedDay.label.toLowerCase()}.
                                                </div>
                                            )}
                                        </section>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}