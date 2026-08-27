import React, { type JSX } from "react";

interface NavbarCollapseProps {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isGenreOpen: boolean;
    setIsGenreOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavbarCollapse({ isMenuOpen, setIsMenuOpen, isGenreOpen, setIsGenreOpen }: NavbarCollapseProps): JSX.Element {
    return (
        <>
            <div 
                className="hh3d-drawer-backdrop" 
                style={{ 
                    pointerEvents: isMenuOpen ? "auto" : "none",
                    opacity: isMenuOpen ? 1 : 0,
                    transition: "opacity 0.2s ease"
                }}
                onClick={() => setIsMenuOpen(false)} 
            ></div>

            <div
                className={`navbar-collapse hh3d-nav-drawer-portal main-navigation collapse ${
                    isMenuOpen ? "in" : ""
                }`}
                id="halim"
                aria-expanded={isMenuOpen}
            >
                <div className="hh3d-drawer-head">
                    <span className="hh3d-drawer-title">Danh Mục</span>
                    <button 
                        type="button" 
                        className="hh3d-drawer-close" 
                        aria-label="Đóng menu"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="menu-menu-container">
                    <ul id="menu-menu" className="nav navbar-nav navbar-left">
                        <li className="hh3d-mi mi-home hh3d-mi-active">
                            <a title="Trang chủ" href="/">Trang chủ</a>
                        </li>
                        
                        <li className={`hh3d-mi mi-genre dropdown ${isGenreOpen ? "open" : ""}`}>
                            <a
                                title="Thể Loại"
                                href="#"
                                data-toggle="dropdown"
                                className="dropdown-toggle"
                                aria-haspopup="true"
                                aria-expanded={isGenreOpen}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsGenreOpen(!isGenreOpen); 
                                }}
                            >
                                Thể Loại <span className="caret" />
                            </a>
                            <ul role="menu" className="dropdown-menu">
                                <li><a title="Huyền Huyễn" href="/huyen-huyen">Huyền Huyễn</a></li>
                                <li><a title="Xuyên Không" href="/xuyen-khong">Xuyên Không</a></li>
                                <li><a title="Trùng Sinh" href="/trung-sinh">Trùng Sinh</a></li>
                                <li><a title="Tiên Hiệp" href="/tien-hiep">Tiên Hiệp</a></li>
                                <li><a title="Cổ Trang" href="/co-trang">Cổ Trang</a></li>
                                <li><a title="Hài Hước" href="/hai-huoc">Hài Hước</a></li>
                                <li><a title="Kiếm Hiệp" href="/kiem-hiep">Kiếm Hiệp</a></li>
                                <li><a title="Hiện Đại" href="/hien-dai">Hiện Đại</a></li>
                            </ul>
                        </li>

                        <li className="hh3d-mi mi-movie"><a title="Phim Lẻ" href="/phim-le">Phim Lẻ</a></li>
                        <li className="hh3d-mi mi-airing"><a title="Đang Chiếu" href="/phim-dang-chieu">Đang Chiếu</a></li>
                        <li className="hh3d-mi mi-schedule"><a title="Lịch Chiếu" href="/lich-chiếu">Lịch Chiếu</a></li>
                        <li className="hh3d-mi mi-completed"><a title="Hoàn Thành" href="/phim-hoan-thanh">Hoàn Thành</a></li>
                        <li className="hh3d-mi mi-top"><a title="Top 10 HH3D" href="/bang-xep-hang">Top 10 HH3D</a></li>
                        <li className="hh3d-mi mi-rated"><a title="Đánh Giá Cao" href="/danh-gia-cao">Đánh Giá Cao</a></li>
                    </ul>
                </div>
            </div>
        </>
    );
}
