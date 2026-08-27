import type React from "react";
import '../styles/header.css'

const Header: React.FC = () => {

    return (
        <header id="header">
            <div className="container">
                <div className="row d-block clearfix" id="headwrap">
                    <div className="col-md-3 col-sm-6 slogan float-start">
                        <p className="site-title">
                            <a href="#" rel="home">Hoạt Hình Trung Quốc – Xem Hoạt Hình 3D Hay | HH3D</a>
                        </p>
                    </div>
                    <div className="col-md-5 col-sm-6 halim-search-form float-start">
                        <div className="header-nav">
                            <div className="col-xs-12">
                                <form id="search-form-pc" name="halimForm" role="search" action="#" method="GET">
                                    <div className="form-group">
                                        <div className="input-group col-xs-12">
                                            <input id="search" type="text" className="form-control" placeholder="Nhập từ khoá tìm kiếm..." required={true} />
                                            <i className="animate-spin hl-spin4 hidden" />
                                        </div>
                                    </div>
                                </form>
                                <ul className="ui-autocomplete ajax-results hidden" />
                            </div>
                        </div>
                    </div>

                    <div className="mobile-icon-menu">
                        <div className="nav-items flex">
                            <a href="#">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu"> history </span>
                                </div>
                                <span className="nav-label">Lịch sử</span>
                            </a>

                            <a href="#">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu"> bookmarks </span>
                                </div>
                                <span className="nav-label">Theo dõi</span>
                            </a>

                            <a id="custom-open-login-modal">
                                <div>
                                    <span className="material-icons-round1 material-icons-menu"> login </span>
                                </div>
                                <span className="nav-label">Đăng nhập</span>
                            </a>
                        </div>

                    </div>
                </div>

                <div className="notice-pc">
                    Lưu hoặc nhớ ngay link rút gọn
                    <b>
                        <span color="#FFA500" style={{ 'fontSize': '17px', '--color': '#FFA500' }}>
                            bit.ly/hh3d
                        </span>
                    </b>
                    để truy cập sẽ tự chuyển đến tên miền mới khi nhà mạng chặn
                </div>

                <div className="navbar-container">
                    <div className="container">
                        <nav className="navbar halim-navbar main-navigation">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed float-start btn-hamburger">
                                    <span className="sr-only">
                                        Menu
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3" stroke="#e3e3e3" stroke-width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                                </button>
                                <button type="button" className="navbar-toggle collapsed float-end expand-search-form btn-hamburger">
                                    <span className="hl-search" aria-hidden="true" />
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3" stroke="#e3e3e3" stroke-width="50"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>

                                </button>
                            </div>
                            {/* hh3d-nav-drawer-anchor */}

                        </nav>
                        <div className="collapse navbar-collapse hh3d-navbar-search-collapse" id="search-form">
                            <div id="mobile-search-form" className="halim-search-form" />
                        </div>
                        <div id="hh3d-navbar-mobile-extra" className="hh3d-navbar-mobile-extra" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header