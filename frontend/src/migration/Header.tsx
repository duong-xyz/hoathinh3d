import { startTransition, useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Header({ setIsMenuOpen, setIsSearchOpen, setIsModalOpen, isGenreOpen, setIsGenreOpen, setNoti }
    : {
    setIsMenuOpen: any;
    setIsSearchOpen: any;
    setIsModalOpen: any;
    isGenreOpen: any;
    setIsGenreOpen: any;
    setNoti?: any;
}
) {

    const [scrollState, setScrollState] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let currentLastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 50) {
                setScrollState("top");
            }
            else if (currentScrollY > 50 && currentScrollY <= 300) {
                setScrollState("fixed");
            }
            else {
                if (currentScrollY > currentLastScrollY + 5) {
                    setScrollState("heads-up");
                } else if (currentScrollY < currentLastScrollY - 5) {
                    setScrollState("fixed");
                }
            }

            currentLastScrollY = currentScrollY;
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getNavbarClass = () => {
        if (scrollState === "top") return "navbar-container";
        if (scrollState === "fixed") return "navbar-container navbar-fixed-top";
        if (scrollState === "heads-up") return "navbar-container navbar-fixed-top heads-up";
        return "navbar-container";
    };
    const [accMenuId, setAccMenuId] = useState<number | boolean>(false);
    const handleToggleAccMenu = (id:any) => {
        setAccMenuId(accMenuId === id ? null : id);
    };
    const handleToggleCollapse = () => {
        startTransition(() => {
            setIsMenuOpen(true);
        });
    };
    return (
        <header id="header">
            <div className="container">
                <div className="row" id="headwrap">
                    <div className="col-md-3 col-sm-6 slogan">
                        <p className="site-title">
                            <Link to="/" rel="home">
                                Hoạt Hình Trung Quốc – Xem Hoạt Hình 3D Hay | HH3D
                            </Link>
                        </p>
                    </div>
                    <SearchForm />
                    <div className="mobile-icon-menu">
                        <div className="nav-items flex">
                            {/* <Link to="/history">
                                <div>

                                    <span className="material-icons-round1 material-icons-menu">

                                        history
                                    </span>
                                </div>
                                <span className="nav-label">Lịch sử</span>
                            </Link> */}
                            {/* <Link to="/follow">
                                <div>

                                    <span className="material-icons-round1 material-icons-menu">

                                        bookmarks
                                    </span>
                                </div>
                                <span className="nav-label">Theo dõi</span>
                            </Link> */}
                            <a id="custom-open-login-modal"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    setIsModalOpen(true); 
                                }}
                                style={{ cursor: "pointer" }} 
                            >
                                <div>

                                    <span className="material-icons-round1 material-icons-menu">

                                        login
                                    </span>
                                </div>
                                <span className="nav-label">Đăng nhập</span>
                            </a>
                            <a href="/admin/" className="xc-nav-icon-btn">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu">
                                        groups
                                    </span>
                                    <span className="xc-nav-dot" />
                                </div>
                                <span className="nav-label">Quản lý Admin</span>
                            </a>
                            {/* <a
                                href="#"
                                id="get-user-info"
                                data-view="hide"
                                data-avatar="/stickers/profile_photo.png"
                                onClick={(e) => { e.preventDefault(); handleToggleAccMenu(1) }}
                            >
                                <div>
                                    {!accMenuId && (
                                        <img
                                            src="/stickers/profile_photo.png"
                                            alt="avatar"
                                            className="nav-avatar-img"
                                        />)}
                                    {accMenuId && (
                                        <span className="material-icons-round1 material-icons-menu">
                                            highlight_off
                                        </span>)}
                                </div>
                                <span className="nav-label">Tài khoản</span>
                            </a>
                            <div className="load-notification relative">

                                <a
                                    href="#"
                                    id="get-notifications"
                                    className="noti-nav-btn"
                                    data-view="hide"
                                    aria-expanded="false"
                                    aria-controls="dropdown-noti"
                                    aria-haspopup="true"
                                    onClick={(e) => { e.preventDefault(); setNoti(true) }}
                                >
                                    <div className="noti-nav-icon-wrap">

                                        <span
                                            className="noti-nav-icon"
                                            id="notification-badge"
                                            aria-hidden="true"
                                        >

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={22}
                                                height={22}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                focusable="false"
                                            >

                                                <path
                                                    d="M12 22a1.75 1.75 0 0 0 1.73-1.5h-3.46A1.75 1.75 0 0 0 12 22Zm7-4.5v-4.86c0-3.14-2.11-5.78-5-6.64V5.5a1.5 1.5 0 1 0-3 0v.5C8.11 6.86 6 9.5 6 12.64V17.5L4 19.5v.5h16v-.5l-1-2Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <span className="nav-label">Thông báo</span>
                                </a>
                            </div> */}


                        </div>
                    </div>
                </div>

                <div id="navdrop" className="btn-dark">
                    <div className="tooltip" />
                    <div className={`wrapper ${accMenuId && "show"}`} style={{ height: 395, overflowY: "auto" }}>
                        <ul className="menu-bar" style={{ marginLeft: 0, display: accMenuId === 1 ? "block" : "none" }}>

                            <span id="ch_head_name">
                                <div
                                    className="color_pham_nhan"
                                    style={{
                                        textAlign: "center",
                                        fontSize: "13px !important",
                                        lineHeight: "1.3 !important"
                                    }}
                                >

                                    Dương Hoàng1
                                </div>
                            </span>
                            <li className="profile-dsf3SD_02-1SAd9">

                                <a href="/profile/189458">
                                    <div className="avatar-container-header adjust-frame ">
                                        <img
                                            src="/stickers/profile_photo.png"
                                            className="responsive-img"
                                        />
                                    </div>
                                    <div>

                                        <br />
                                        <span id="head_manage_acc">
                                            <div style={{ textAlign: "center", color: "orange" }}>

                                                ✨ Tu Vi: 959
                                            </div>
                                        </span>
                                        <br />
                                        <span id="head_manage_acc">
                                            <div style={{ textAlign: "center", color: "orange" }}>

                                                💎 Tinh Thạch: 0
                                            </div>
                                        </span>
                                        <br />
                                        <span id="head_manage_acc">
                                            <div style={{ textAlign: "center", color: "orange" }}>

                                                🔮 Tiên Ngọc: 0
                                            </div>
                                        </span>
                                    </div>
                                </a>
                            </li>
                            <li className="setting-item">

                                <a href="javascript:void(0)" onClick={() => { handleToggleAccMenu(3); }}>
                                    <div className="icon">

                                        <span className="material-icons">info</span>
                                    </div>
                                    <span>Thông Tin</span>
                                    <i className="material-icons">keyboard_arrow_right</i>
                                </a>
                            </li>
                            <li className="help-item">

                                <a href="javascript:void(0)" onClick={() => { handleToggleAccMenu(4); }}>
                                    <div className="icon">
                                        <span className="material-icons">apps</span>
                                    </div>
                                    Hoạt Động<i className="material-icons">keyboard_arrow_right</i>
                                </a>
                            </li>
                            <li className="theme-item">

                                <a href="javascript:void(0)" onClick={() => { handleToggleAccMenu(2); }}>
                                    <div className="icon">
                                        <span className="material-icons">stars</span>
                                    </div>
                                    Bảng Xếp Hạng<i className="material-icons">keyboard_arrow_right</i>
                                </a>
                            </li>
                            <li className="tdn-nav-notice">

                                <a href="/thien-dao-thong-bao">
                                    <div className="icon">
                                        <span className="material-icons">notifications</span>
                                    </div>
                                    Thông Báo
                                </a>
                            </li>
                            <li className="hh3d-nav-community">

                                <a href="https://hoathinh3d.st/cong-dong">
                                    <div className="icon">
                                        <span className="material-icons">groups</span>
                                    </div>
                                    Cộng Đồng HH3D
                                </a>
                            </li>
                            <li>

                                <a href="/phong-chat-version-2-0">
                                    <div className="icon">
                                        <span className="material-icons">chat</span>
                                    </div>
                                    Phòng Chat
                                </a>
                            </li>
                            <li>

                                <a href="/my-account/user-logout">
                                    <div className="icon">
                                        <span className="material-icons">logout</span>
                                    </div>
                                    Đăng Xuất
                                </a>
                            </li>
                        </ul>
                        <ul className="theme-drop" style={{ display: accMenuId === 2 ? "block" : "none" }}>
                            <div className="arrow">

                                <i className=" back-theme-btn material-icons waves-effect"
                                    onClick={() => { handleToggleAccMenu(1); }}
                                >
                                    arrow_back
                                </i>
                                <span>Bảng xếp hạng</span>
                            </div>
                            <hr />
                            <li>

                                <a href="/bang-xep-hang">
                                    <div className="icon">
                                        <span className="material-icons">star</span>
                                    </div>
                                    BXH Tu Vi
                                </a>
                            </li>
                            <li>

                                <a href="/bang-xep-hang-truyen-thua">
                                    <div className="icon">
                                        <span className="material-icons">star</span>
                                    </div>
                                    BXH Truyền Thừa
                                </a>
                            </li>
                            <li>

                                <a href="/bang-xep-hang-tong-mon?t=3a32e">
                                    <div className="icon">
                                        <span className="material-icons">star</span>
                                    </div>
                                    BXH Tông Môn
                                </a>
                            </li>
                            <li>

                                <a href="/bang-phu-hao-tinh-thach?t=3a32e">
                                    <div className="icon">
                                        <span className="material-icons">star</span>
                                    </div>
                                    BXH Phú Hào
                                </a>
                            </li>
                            <li>

                                <a href="/bxh-tien-duyen?t=3a32e">
                                    <div className="icon">
                                        <span className="material-icons">favorite</span>
                                    </div>
                                    BXH Tiên Duyên
                                </a>
                            </li>
                            <li>

                                <a href="/do-kiep?t=3a32e">
                                    <div className="icon">
                                        <span className="material-icons">bolt</span>
                                    </div>
                                    Bảng Độ Kiếp
                                </a>
                            </li>
                            <li>

                                <a href="/cong-duc-kim-bang">
                                    <div className="icon">
                                        <span className="material-icons">auto_awesome</span>
                                    </div>
                                    <span style={{ color: "#fbbf24", fontWeight: 600 }}>
                                        Công Đức Kim Bảng
                                    </span>
                                </a>
                            </li>
                        </ul>
                        <ul className="setting-drop" style={{ display: accMenuId === 3 ? "block" : "none" }}>
                            <div className="arrow">

                                <i className=" back-setting-btn material-icons waves-effect"
                                    onClick={() => { handleToggleAccMenu(1); }}
                                >
                                    arrow_back
                                </i>
                                <span>Thông tin</span>
                            </div>
                            <hr />
                            <li>

                                <a href="/cai-dat-tai-khoan" onClick={(e) => {e.preventDefault(); navigate("/account-setting")}}>
                                    <div className="icon">
                                        <span className="material-icons">account_box</span>
                                    </div>
                                    Cá Nhân
                                </a>
                            </li>
                            <li>

                                <a href="https://hoathinh3d.st/tu-bao-cac-hh3d/">
                                    <div className="icon">
                                        <span className="material-icons">storefront</span>
                                    </div>
                                    Tụ Bảo Các
                                </a>
                            </li>
                            <li>

                                <a href="/huyen-bao-cac">
                                    <div className="icon">
                                        <span className="material-icons">auto_awesome</span>
                                    </div>
                                    Huyễn Bảo Các
                                </a>
                            </li>
                            <li>

                                <a href="/vip-hh3d">
                                    <div className="icon">
                                        <span className="material-icons">star</span>
                                    </div>
                                    XU HH3D
                                </a>
                            </li>
                            <li>

                                <a href="/danh-sach-thanh-vien-tong-mon">
                                    <div className="icon">
                                        <span className="material-icons">groups</span>
                                    </div>
                                    Tông Môn
                                </a>
                            </li>
                            <li>

                                <a href="/cap-nhat-he-thong-tu-luyen">
                                    <div className="icon">
                                        <span className="material-icons">manage_history</span>
                                    </div>
                                    Đổi Hệ Thống
                                </a>
                            </li>
                            <li>

                                <a href="/linh-thach">
                                    <div className="icon">
                                        <span className="material-icons">key</span>
                                    </div>
                                    Hấp Thu Linh Thạch
                                </a>
                            </li>
                            <li>

                                <a href="/thien-dao-ban-thuong">
                                    <div className="icon">
                                        <span className="material-icons">card_giftcard</span>
                                    </div>
                                    TĐ Ban Thưởng
                                </a>
                            </li>
                            <li>

                                <a href="/sap-xep-phap-bao">
                                    <div className="icon">
                                        <span className="material-icons">swap_vert</span>
                                    </div>
                                    Sắp Xếp Pháp Bảo
                                </a>
                            </li>
                            <li>

                                <a href="/phap-tuong">
                                    <div className="icon">
                                        <span className="material-icons">manage_accounts</span>
                                    </div>
                                    Quản Lý Pháp Tướng
                                </a>
                            </li>
                            <li>

                                <a href="/quan-ly-khung-avatar">
                                    <div className="icon">
                                        <span className="material-icons">manage_accounts</span>
                                    </div>
                                    Quản Lý Khung Avatar
                                </a>
                            </li>
                            <li>

                                <a href="/quan-ly-danh-hieu">
                                    <div className="icon">
                                        <span className="material-icons">military_tech</span>
                                    </div>
                                    Quản Lý Danh Hiệu
                                </a>
                            </li>
                            <li>

                                <a href="/cai-dat-mau-chat">
                                    <div className="icon">
                                        <span className="material-icons">palette</span>
                                    </div>
                                    Cài Đặt Màu Chat
                                </a>
                            </li>
                            <li>

                                <a href="/mini-games-hh3d">
                                    <div className="icon">
                                        <span className="material-icons">games</span>
                                    </div>
                                    Mini Games
                                </a>
                            </li>
                            <li>

                                <a href="/gop-y-bao-loi?t=3a32e">
                                    <div className="icon">
                                        <span className="material-icons">comment</span>
                                    </div>
                                    Góp Ý-Báo Lỗi
                                </a>
                            </li>
                            <li>

                                <a href="/cach-tinh-tu-vi-hoathinh3d">
                                    <div className="icon">
                                        <span className="material-icons">whatshot</span>
                                    </div>
                                    Hướng Dẫn
                                </a>
                            </li>
                        </ul>
                        <ul className="help-drop" style={{ display: accMenuId === 4 ? "block" : "none" }}>
                            <div className="arrow">

                                <i className=" back-help-btn material-icons waves-effect"
                                    onClick={() => { handleToggleAccMenu(1); }}
                                >
                                    arrow_back
                                </i>
                                <span>Hoạt Động</span>
                            </div>
                            <hr />
                            <li
                                style={{
                                    background: "rgba(245,197,66,.08)",
                                    border: "1px solid rgba(245,197,66,.2)",
                                    borderRadius: 10,
                                    marginBottom: 4
                                }}
                            >

                                <a href="/nhiem-vu-hang-ngay">
                                    <div className="icon" style={{ background: "rgba(245,197,66,.15)" }}>
                                        <span className="material-icons" style={{ color: "#f5c542" }}>
                                            task_alt
                                        </span>
                                    </div>
                                    <span style={{ color: "#f5c542", fontWeight: 700 }}>
                                        Nhiệm Vụ Hằng Ngày
                                    </span>
                                </a>
                            </li>
                            <li
                                style={{
                                    background: "rgba(160,32,240,.08)",
                                    border: "1px solid rgba(160,32,240,.25)",
                                    borderRadius: 10,
                                    marginBottom: 4
                                }}
                            >

                                <a href="/do-kiep-dai">
                                    <div className="icon" style={{ background: "rgba(160,32,240,.15)" }}>
                                        <span className="material-icons" style={{ color: "#c084fc" }}>
                                            bolt
                                        </span>
                                    </div>
                                    <span style={{ color: "#c084fc", fontWeight: 700 }}>Độ Kiếp Đài</span>
                                </a>
                            </li>
                            <li
                                style={{
                                    position: "relative",
                                    background: "rgba(255,140,0,.08)",
                                    border: "1px solid rgba(255,140,0,.25)",
                                    borderRadius: 10,
                                    marginBottom: 4
                                }}
                            >

                                <span
                                    style={{
                                        position: "absolute",
                                        top: 5,
                                        right: 8,
                                        zIndex: 2,
                                        fontSize: 9,
                                        fontWeight: 700,
                                        lineHeight: "1.2",
                                        padding: "2px 6px",
                                        borderRadius: 8,
                                        background: "linear-gradient(135deg,#ff8c00,#ff4757)",
                                        color: "#fff",
                                        boxShadow: "0 1px 4px rgba(0,0,0,.35)",
                                        pointerEvents: "none"
                                    }}
                                >
                                    8/7
                                </span>
                                <a href="/dua-top-hh3d">
                                    <div className="icon" style={{ background: "rgba(255,140,0,.15)" }}>
                                        <span className="material-icons" style={{ color: "#ff8c00" }}>
                                            emoji_events
                                        </span>
                                    </div>
                                    <span style={{ color: "#ffb347", fontWeight: 700 }}>HĐ Đua Top</span>
                                </a>
                            </li>
                            <li
                                style={{
                                    position: "relative",
                                    background: "rgba(56,189,176,.08)",
                                    border: "1px solid rgba(56,189,176,.28)",
                                    borderRadius: 10,
                                    marginBottom: 4
                                }}
                            >

                                <span
                                    style={{
                                        position: "absolute",
                                        top: 5,
                                        right: 8,
                                        zIndex: 2,
                                        fontSize: 9,
                                        fontWeight: 700,
                                        lineHeight: "1.2",
                                        padding: "2px 6px",
                                        borderRadius: 8,
                                        background: "linear-gradient(135deg,#5eead4,#14b8a6)",
                                        color: "#042f2e",
                                        boxShadow: "0 1px 4px rgba(0,0,0,.35)",
                                        pointerEvents: "none"
                                    }}
                                >
                                    8/7
                                </span>
                                <a href="/du-doan-dua-top-tong-mon">
                                    <div className="icon" style={{ background: "rgba(56,189,176,.15)" }}>
                                        <span className="material-icons" style={{ color: "#2dd4bf" }}>
                                            psychology
                                        </span>
                                    </div>
                                    <span style={{ color: "#5eead4", fontWeight: 700 }}>
                                        Dự Đoán Đua Top
                                    </span>
                                </a>
                            </li>
                            <li>

                                <a href="/diem-danh">
                                    <div className="icon">
                                        <span className="material-icons">calendar_month</span>
                                    </div>
                                    Điểm Danh
                                </a>
                            </li>
                            <li>

                                <a href="/luyen-dan-duong">
                                    <div className="icon">
                                        <span className="material-icons">science</span>
                                    </div>
                                    Luyện Đan Đường
                                </a>
                            </li>
                            <li>

                                <a href="/khoang-mach">
                                    <div className="icon">
                                        <span className="material-icons">diamond</span>
                                    </div>
                                    Khoáng Mạch
                                </a>
                            </li>
                            <li>

                                <a href="/hoang-vuc">
                                    <div className="icon">
                                        <span className="material-icons">local_fire_department</span>
                                    </div>
                                    Hoang Vực
                                </a>
                            </li>
                            <li>

                                <a href="/me-cung">
                                    <div className="icon">
                                        <span className="material-icons">auto_awesome</span>
                                    </div>
                                    Mê Cung
                                </a>
                            </li>
                            <li>

                                <a href="/phuc-loi-duong">
                                    <div className="icon">
                                        <span className="material-icons">redeem</span>
                                    </div>
                                    Phúc Lợi Đường
                                </a>
                            </li>
                            <li>

                                <a href="/do-thach-hh3d">
                                    <div className="icon">
                                        <span className="material-icons">casino</span>
                                    </div>
                                    Đổ Thạch
                                </a>
                            </li>
                            <li>

                                <a href="/tien-duyen">
                                    <div className="icon">
                                        <span className="material-icons">favorite</span>
                                    </div>
                                    Tiên Duyên
                                </a>
                            </li>
                            <li>

                                <a href="/vong-quay-phuc-van">
                                    <div className="icon">
                                        <span className="material-icons">rotate_right</span>
                                    </div>
                                    Vòng Quay Phúc Vận
                                </a>
                            </li>
                            <li>

                                <a href="/hh3der">
                                    <div className="icon">
                                        <span className="material-icons">person_search</span>
                                    </div>
                                    Tìm Bạn ?
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="notice-pc">
                    Lưu hoặc nhớ ngay link rút gọn
                    <b>
                        <span color="#FFA500" style={{ fontSize: 17 }}>
                            bit.ly/hh3d
                        </span>
                    </b>
                    để truy cập sẽ tự chuyển đến tên miền mới khi nhà mạng chặn
                </div>
                <div className="notice-mobile">
                    Lưu hoặc nhớ ngay link rút gọn
                    <b>
                        <span color="#FFA500" style={{ fontSize: 17 }}>
                            bit.ly/hh3d
                        </span>
                    </b>
                    để truy cập sẽ tự chuyển đến tên miền mới khi nhà mạng chặn
                </div>
                <div className={getNavbarClass()}>
                    <div className="container">
                        <nav
                            className="navbar halim-navbar main-navigation"
                            role="navigation"
                            aria-label="Menu chính"
                            data-dropdown-hover={1}
                        >
                            <div className="navbar-header">

                                <button
                                    type="button"
                                    className="navbar-toggle collapsed pull-left"
                                    data-toggle="collapse"
                                    data-target="#halim"
                                    aria-expanded="false"
                                    onClick={() => handleToggleCollapse()}
                                >

                                    <span className="sr-only"> Menu </span>
                                    <span className="icon-bar" /> <span className="icon-bar" />
                                    <span className="icon-bar" />
                                </button>
                                <button
                                    type="button"
                                    className="navbar-toggle collapsed pull-right expand-search-form"
                                    data-toggle="collapse"
                                    data-target="#search-form"
                                    aria-expanded="false"
                                    onClick={() => setIsSearchOpen(true)}
                                >

                                    <span className="hl-search" style={{ color: '#a5a5a5' }} aria-hidden="true" />
                                </button>
                            </div>
                            <div className="collapse navbar-collapse" id="halim">
                                <div className="menu-menu-container">
                                    <ul id="menu-menu" className="nav navbar-nav navbar-left">
                                        <li className="hh3d-mi mi-home hh3d-mi-active">
                                            <a title="&ensp;Trang chủ"
                                                onClick={(e) => { e.preventDefault(); navigate("/") }}
                                                href="#"
                                            >
                                            &ensp;Trang chủ
                                            </a>
                                        </li>
                                        <li className="hh3d-mi mi-schedule">
                                            <a
                                                title="&ensp;Lịch Chiếu"
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); navigate("/schedule") }}
                                            >
                                            &ensp;Lịch Chiếu
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        <div
                            className="collapse navbar-collapse hh3d-navbar-search-collapse"
                            id="search-form"
                        >
                            <div id="mobile-search-form" className="halim-search-form" />
                        </div>

                        <div
                            id="hh3d-navbar-mobile-extra"
                            className="hh3d-navbar-mobile-extra"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}