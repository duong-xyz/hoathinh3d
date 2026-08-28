import type React from "react";
import css from '../assets/test.css?raw';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


interface Movie {
    id: string;
    title: string;
    image: string;
    rate: number;
}
const data: Movie[] = [
    {
        id: '1',
        title: 'Trảm Thần: Phàm Trần Thần Vực',
        image: 'https://hoathinh3d.ad/wp-content/uploads/2024/07/IMG_0533-300x450.jpeg',
        rate: 4.4,
    },
    {
        id: '2',
        title: 'Trảm Thần: Phàm Trần Thần Vực',
        image: 'https://hoathinh3d.ad/wp-content/uploads/2024/07/IMG_0533-300x450.jpeg',
        rate: 4.4,
    },
    {
        id: '3',
        title: 'Trảm Thần: Phàm Trần Thần Vực',
        image: 'https://hoathinh3d.ad/wp-content/uploads/2024/07/IMG_0533-300x450.jpeg',
        rate: 4.4,
    },
    {
        id: '4',
        title: 'Trảm Thần: Phàm Trần Thần Vực',
        image: 'https://hoathinh3d.ad/wp-content/uploads/2024/07/IMG_0533-300x450.jpeg',
        rate: 4.4,
    },
]

export function Test(): React.JSX.Element {
    const [open, setOpen] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    /*const openRef = useRef(open);
    useEffect(() => {
        openRef.current = open;
    }, [open]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const currentOpen = openRef.current;
            if (currentOpen === null) return;
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);*/

    const [loading, setLoading] = useState<boolean>(true);
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        if (open === 1) {
            setLoading(true);
            setMovies([]);
            const timer = setTimeout(() => {
                setMovies(data);
                setLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [open]);
    return (
        <div className="box">
            <style>{css}</style>
            <header>
                <div className="site-title"></div>
                <div className="search">
                    {/* Khi click vào khung input group thì mở menu */}
                    <form action="" className="input-group" onClick={() => setOpen(1)}>
                        <input type="text" className="form-control" placeholder="Nhập từ khóa tìm kiếm..." />
                        <i className="animate-spin hl-spin4"></i>
                    </form>

                    <div className={`desktop-search-suggest ${open === 1 ? "open" : ""}`} ref={containerRef}>
                        <div className="hh3d-search-history">
                            {/* Nội dung danh sách lịch sử tìm kiếm giữ nguyên */}
                            <div className="hh3d-search-history__head">
                                <span className="hh3d-search-history__label">
                                    <span className="material-icons">history</span>
                                    Tìm kiếm gần đây
                                </span>
                                <button className="hh3d-search-history__clear">Xóa tất cả</button>
                            </div>
                            <div className="hh3d-search-history__chips">
                                <div className="hh3d-search-history__chip">
                                    <button className="hh3d-search-history__chip-main">
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
                            <button className="hh3d-search-refresh">
                                <span className="material-icons">refresh</span>
                            </button>
                        </div>
                        <div className="dss-grid">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="dss-skel">
                                        <span className="dss-skel__poster" />
                                    </div>
                                ))
                            ) : (
                                movies.map((movie) => (
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
                </div>
            </header>

            {/* {createPortal(
                <div 
                    id="desktop-search-backdrop" 
                    className={`desktop-search-backdrop ${open === 1 ? "is-open" : ""}`} 
                    aria-hidden="true"
                    onClick={() => setOpen(null)} 
                />,
                document.body // Chỉ định đích đến là thẻ body của trang web
            )} */}
            {open === 1 && createPortal(
                <div
                    id="desktop-search-backdrop"
                    className="desktop-search-backdrop is-open" // Tự động thêm class .is-open trực tiếp khi render
                    aria-hidden="true"
                    onClick={() => setOpen(null)} // CLICK VÀO ĐÂY LÀ ĐÓNG MENU NGAY LẬP TỨC
                />,
                document.body
            )}
        </div>
    );
}
