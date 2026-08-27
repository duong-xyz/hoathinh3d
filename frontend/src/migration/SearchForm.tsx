import React, { useState, useRef, useEffect } from "react";
import type { MovieResponseDto } from "../types/movie";
import { useDebounce } from "../hooks/useDebounce";
import { movieApi } from "../api/movieApi";

const SearchForm = () => {
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const searchContainerRef = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSuggestOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [movies, setMovies] = useState<MovieResponseDto[]>([]);
    const [suggest, setSuggest] = useState<MovieResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setMovies([]);
            setIsLoading(false);
            return;
        }
        const search = async () => {
            try {
                const res = await movieApi.searchMovies(debouncedSearchTerm);
                setMovies(res.content);
            } catch (err) { }
            finally {
                setIsLoading(false);
            }
        }
        search();
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const suggest = async () => {
            try {
                const res = await movieApi.getAllMovies(0, 10);
                setSuggest(res.data.content);
            } catch (err) { }
        }
        suggest();
    }, [])
    const hasQuery = searchTerm.trim().length > 0;
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
            setMovies([]);
        }
    };
    return (
        <div className="col-md-5 col-sm-6 halim-search-form hidden-xs">
            <div className="header-nav" style={{zIndex: 9999}}>
                <div className="col-xs-12" ref={searchContainerRef}>
                    <form
                        id="search-form-pc"
                        name="halimForm"
                        role="search"
                    >
                        <div className="form-group">
                            <div className="input-group col-xs-12">
                                <input
                                    id="search"
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập từ khoá tìm kiếm..."
                                    autoComplete="off"
                                    required
                                    // Khi trỏ chuột vào ô input -> Kích hoạt hiển thị gợi ý dss
                                    onFocus={() => setIsSuggestOpen(true)}
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                />
                                <i className={`animate-spin hl-spin4 ${!isLoading && "hidden"}`} />
                            </div>
                        </div>
                    </form>

                    {isSuggestOpen && (
                        <>
                            {/* list search match */}
                            {hasQuery && (
                                <ul className={`ui-autocomplete ajax-results ${false ? "hidden" : ""}`}>
                                    <li>
                                        Kết quả tìm kiếm: <strong style={{ color: "red" }}>{searchTerm}</strong>
                                    </li>
                                    {movies.map((m) => (
                                        <li className="exact_result" key={`slist-${m.id}`}>
                                            <a href="#">
                                                <div className="halim_list_item">
                                                    <div className="image">
                                                        <img
                                                            src={m.thumbnailUrl}
                                                            alt={m.originalTitle}
                                                        />
                                                    </div>
                                                    <div className="item-text">
                                                        <span className="label">{m.title}</span>
                                                        <span className="enName">{m.originalTitle}</span>
                                                        <span className="date">{m.type}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    ))}

                                </ul>
                            )}
                            {!hasQuery && (
                                <div
                                    id="desktop-search-suggest"
                                    className={`desktop-search-suggest ${isSuggestOpen ? "open" : ""}`}
                                    aria-hidden={!isSuggestOpen}
                                >
                                    <div className="dss-label">
                                        <span className="material-icons">auto_awesome</span>Gợi ý cho bạn
                                    </div>

                                    <div className="dss-grid">
                                        {/* <p className="dss-hint">Không thể tải gợi ý.</p> */}

                                        {/*
              <a href="https://hoathinh3d.st" className="dss-item">
                <div className="dss-thumb">
                  <img src="https://placeholder.com" alt="Phim" />
                </div>
                <div className="dss-meta">
                  <div className="dss-title">Tiêu Đề Phim Hoạt Hình</div>
                  <div className="dss-sub">Tập mới nhất / Trạng thái</div>
                </div>
                <div className="dss-rate">
                  ⭐ 4.8
                </div>
              </a>
              */}
                                        {suggest.map((m) => (
                                            <a
                                                href="#"
                                                className="dss-item"
                                                key={`sugg-${m.id}`}
                                            >
                                                <span className="dss-thumb">
                                                    <img
                                                        src={m.thumbnailUrl}
                                                        alt={m.originalTitle}
                                                        loading="lazy"
                                                    />
                                                </span>
                                                <span className="dss-meta">
                                                    <span className="dss-title">
                                                        {m.title}
                                                    </span>
                                                    <span className="dss-sub">{m.originalTitle}</span>
                                                </span>
                                                <span className="dss-rate">⭐ {m.ratingScore}</span>
                                            </a>
                                        ))}


                                    </div>
                                </div>
                            )}

                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SearchForm;
