import type React from "react";
import css from '../assets/test.css?raw';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Movie {
    id: string;
    title: string;
    enTitle?: string;
    image: string;
    rate: number;
}

const data: Movie[] = [
    {
        id: '1',
        title: 'Trảm Thần: Phàm Trần Thần Vực',
        enTitle: 'God Slaying',
        image: 'https://hoathinh3d.ad/wp-content/uploads/2024/07/IMG_0533-300x450.jpeg',
        rate: 4.4,
    },
    {
        id: '2',
        title: 'Phàm Nhân Tu Tiên: Phong Khởi Thiên Nam',
        enTitle: "A Record of A Mortal's Journey to Immortality",
        image: 'https://hoathinh3d.ad/wp-content/uploads/2023/02/pham-nhan-tu-tien-phong-khoi-thien-nam-remake-300x450.jpg',
        rate: 4.9,
    },
    {
        id: '3',
        title: 'Đấu La Đại Lục 2',
        enTitle: 'Soul Land 2',
        image: 'https://hoathinh3d.ad/wp-content/uploads/2024/07/IMG_0533-300x450.jpeg',
        rate: 4.8,
    },
];

export function Test(): React.JSX.Element {
    const [open, setOpen] = useState<number | null>(null);
    const [query, setQuery] = useState<string>(''); // Quản lý từ khóa gõ vào
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);

    const [suggestLoading, setSuggestLoading] = useState<boolean>(true);
    const [suggestMovies, setSuggestMovies] = useState<Movie[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Logic tải dữ liệu Gợi ý khi vừa Focus vào input
    useEffect(() => {
        if (open === 1 && query === '') {
            setSuggestLoading(true);
            setSuggestMovies([]);
            const timer = setTimeout(() => {
                setSuggestMovies(data);
                setSuggestLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [open, query]);

    // 2. Logic Debounce Tìm kiếm Live khi người dùng nhập từ khóa
    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        const timer = setTimeout(() => {
            // Lọc dữ liệu giả lập theo từ khóa
            const filtered = data.filter(m =>
                m.title.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
            setSearchLoading(false);
        }, 500); // Delay 500ms tránh gửi request liên tục

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="box">
            <style>{css}</style>
            <header className="container">
                <div id="headwrap">
                    <div className="site-title"></div>
                    <div className="search">
                        <form action="" className="input-group" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setOpen(1)}
                            />
                            <i className={`animate-spin hl-spin4 ${searchLoading ? 'active' : ''}`}></i>
                        </form>

                        {/* LỰA CHỌN 1: BẢNG KẾT QUẢ TÌM KIẾM THEO TỪ KHÓA (HIỂN THỊ KHU VỰC NÀY KHU QUERY CÓ GIÁ TRỊ) */}
                        {open === 1 && query.trim() !== '' && (
                            <ul className="ui-autocomplete ajax-results" style={{ display: 'block' }}>
                                <li className="hh3d-live-head">
                                    <span className="hh3d-live-head__label">Kết quả tìm kiếm</span>
                                    <span className="hh3d-live-head__q">"{query}"</span>
                                </li>

                                {searchLoading ? (
                                    <li className="hh3d-live-loading" style={{ padding: '10px', textAlign: 'center' }}>
                                        Đang tìm kiếm...
                                    </li>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((item) => (
                                        <li key={item.id} className="exact_result">
                                            <a href="#">
                                                <div className="halim_list_item hh3d-live-item">
                                                    <div className="image">
                                                        <img src={item.image} alt={item.title} loading="lazy" />
                                                    </div>
                                                    <div className="item-text">
                                                        <span className="label">{item.title}</span>
                                                        {item.enTitle && <span className="enName">{item.enTitle}</span>}
                                                        <span className="hh3d-live-meta">
                                                            <span className="hh3d-live-rate" aria-label="Đánh giá">
                                                                <i className="fa-solid fa-star" aria-hidden="true" />
                                                                {item.rate}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="hh3d-live-empty" style={{ padding: '10px' }}>
                                        Không tìm thấy phim phù hợp
                                    </li>
                                )}
                            </ul>
                        )}

                        {/* LỰA CHỌN 2: BẢNG GỢI Ý MẶC ĐỊNH (HIỂN THỊ KHI CHƯA GÕ TỪ KHÓA) */}
                        {open === 1 && query.trim() === '' && (
                            <div className="desktop-search-suggest open" ref={containerRef}>
                                <div className="hh3d-search-history">
                                    <div className="hh3d-search-history__head">
                                        <span className="hh3d-search-history__label">
                                            <span className="material-icons">history</span>
                                            Tìm kiếm gần đây
                                        </span>
                                        <button className="hh3d-search-history__clear">Xóa tất cả</button>
                                    </div>
                                    <div className="hh3d-search-history__chips">
                                        <div className="hh3d-search-history__chip">
                                            <button
                                                className="hh3d-search-history__chip-main"
                                                onClick={() => setQuery("tiên ng")}
                                            >
                                                <span className="material-icons hh3d-search-history__chip-icon">history</span>
                                                <span className="hh3d-search-history__chip-text">tiên ng</span>
                                            </button>
                                            <button className="hh3d-search-history__chip-x">
                                                <span className="material-icons">close</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="hh3d-search-section-head">
                                    <div className="hh3d-search-section-label dss-label">
                                        <span className="material-icons">auto_awesome</span>
                                        Gợi ý cho bạn
                                    </div>
                                    <button className="hh3d-search-refresh" onClick={() => setSuggestLoading(true)}>
                                        <span className="material-icons">refresh</span>
                                    </button>
                                </div>
                                <div className="dss-grid">
                                    {suggestLoading ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className="dss-skel">
                                                <span className="dss-skel__poster" />
                                            </div>
                                        ))
                                    ) : (
                                        suggestMovies.map((movie) => (
                                            <a key={movie.id} href="#" className="dss-card">
                                                <span className="dss-card__poster">
                                                    <img src={movie.image} alt={movie.title} loading="lazy" />
                                                    <span className="dss-card__rate">
                                                        <i className="fa-solid fa-star"></i>
                                                        {movie.rate}
                                                    </span>
                                                    <span className="dss-card__title">{movie.title}</span>
                                                </span>
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mobile-icon-menu">
                        <div className="nav-items flex">
                            <a href="#">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu">
                                        history
                                    </span>
                                </div>
                                <span className="nav-label">
                                    Lịch sử
                                </span>
                            </a>
                            <a href="#">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu">
                                        bookmarks
                                    </span>
                                </div>
                                <span className="nav-label">
                                    Theo dõi
                                </span>
                            </a>
                            <a id="custom-open-login-modal">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu">
                                        login
                                    </span>
                                </div>
                                <span className="nav-label">
                                    Đăng nhập
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="notice-pc">
                    Lưu hoặc nhớ ngay link rút gọn
                    <b>
                        <span color="#FFA500" style={{ 'fontSize': '17px' }}>
                            bit.ly/hh3d
                        </span>
                    </b>
                    để truy cập sẽ tự chuyển đến tên miền mới khi nhà mạng chặn
                </div>
                <div className="notice-mobile">
                    Lưu hoặc nhớ ngay link rút gọn
                    <b>
                        <span color="#FFA500" style={{ 'fontSize': '17px' }}>
                            bit.ly/hh3d
                        </span>
                    </b>
                    để truy cập sẽ tự chuyển đến tên miền mới khi nhà mạng chặn
                </div>
            </header>

            {open === 1 && createPortal(
                <div
                    id="desktop-search-backdrop"
                    className="desktop-search-backdrop is-open"
                    onMouseDown={() => setOpen(null)}
                />,
                document.body
            )}
        </div>
    );
}