import React, { useState, useEffect, useRef } from "react";

const SearchFullscreenOverlay: React.FC<any> = ({ isOpen, onClose }: any) => {
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        } else {
            setSearchQuery("");
        }
    }, [isOpen]);

    return (
        <div
            id="search-fullscreen-overlay"
            className={isOpen ? "active" : ""}
        >
            <div className="search-overlay-header">
                <span className="material-icons search-overlay-search-icon">
                    search
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    id="search-overlay-input"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    id="search-overlay-close"
                    type="button"
                    onClick={onClose}
                >
                    <span className="material-icons">close</span>
                </button>
            </div>

            <div
                id="search-overlay-suggestions"
                className="search-overlay-suggestions"
                style={{ display: searchQuery === "" ? "block" : "none" }}
            >
                <div className="search-overlay-trending-label">
                    <span
                        className="material-icons"
                        style={{
                            fontSize: 15,
                            verticalAlign: "middle",
                            color: "#ff6b35"
                        }}
                    >
                        auto_awesome
                    </span>{" "}
                    Gợi ý cho bạn
                </div>
                <div
                    id="search-overlay-trending-grid"
                    className="search-overlay-trending-grid"
                >
                    <div className="search-overlay-loading">
                        <span className="material-icons">autorenew</span>
                    </div>
                    <a
                        href="https://hoathinh3d.st/tien-nghich-than-lam-chi-chien"
                        className="dss-item"
                    >
                        <span className="dss-thumb">
                            <img
                                src="https://hoathinh3d.st/wp-content/uploads/2025/05/tien-nghich-than-lam-chi-chien-300x450.jpg"
                                alt="Tiên Nghịch - Thần Lâm Chi Chiến Movie"
                                loading="lazy"
                            />
                        </span>
                        <span className="dss-meta">
                            <span className="dss-title">Tiên Nghịch - Thần Lâm Chi Chiến Movie</span>
                            <span className="dss-sub">Renegade Immortal: Battle of God Arrival</span>
                        </span>
                        <span className="dss-rate">⭐ 4.7</span>
                    </a>
                    <a
                        href="https://hoathinh3d.st/tien-nghich-than-lam-chi-chien"
                        className="dss-item"
                    >
                        <span className="dss-thumb">
                            <img
                                src="https://hoathinh3d.st/wp-content/uploads/2025/05/tien-nghich-than-lam-chi-chien-300x450.jpg"
                                alt="Tiên Nghịch - Thần Lâm Chi Chiến Movie"
                                loading="lazy"
                            />
                        </span>
                        <span className="dss-meta">
                            <span className="dss-title">Tiên Nghịch - Thần Lâm Chi Chiến Movie</span>
                            <span className="dss-sub">Renegade Immortal: Battle of God Arrival</span>
                        </span>
                        <span className="dss-rate">⭐ 4.7</span>
                    </a>

                </div>
            </div>

            <div
                id="search-overlay-results"
                className="search-overlay-results"
                style={{ display: searchQuery !== "" ? "block" : "none" }}
            >
                {searchQuery !== "" && <div className="search-overlay-loading">
                    <span className="material-icons">autorenew</span>
                </div>}
                <ul>
                    <li>
                        Đang tìm kiếm kết quả cho: <strong style={{ color: "red" }}>{searchQuery}</strong>
                    </li>
                    <li className="exact_result">
                        <a href="https://hoathinh3d.st/tu-tien-gia-dai-chien-sieu-nang-luc">
                            <div className="halim_list_item">
                                <div className="image">
                                    <img
                                        src="https://hoathinh3d.st/wp-content/uploads/2026/02/Tu-Tien-Gia-Dai-Chien-Sieu-Nang-Luc-300x450-1.webp"
                                        alt="Tu Tiên Giả Đại Chiến Siêu Năng Lực"
                                    />
                                </div>
                                <div className="item-text">
                                    <span className="label">Tu Tiên Giả Đại Chiến Siêu Năng Lực</span>
                                    <span className="enName">Cultivator vs. Superpower 3D</span>
                                    <span className="date">14/02/2026</span>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li className="exact_result">
                        <a href="https://hoathinh3d.st/tien-nghich">
                            <div className="halim_list_item">
                                <div className="image">
                                    <img
                                        src="https://hoathinh3d.st/wp-content/uploads/2023/09/tien-nghich-6-300x450.jpg"
                                        alt="Tiên Nghịch"
                                    />
                                </div>
                                <div className="item-text">
                                    <span className="label">Tiên Nghịch</span>
                                    <span className="enName">Xian Ni</span>
                                    <span className="date">01/09/2023</span>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SearchFullscreenOverlay;
