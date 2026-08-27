import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logout } from '../store/slices/authSlice';
import styles from '../styles/admin.css?raw';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  return (
    <div className="admin-layout">
      <style>{styles}</style>
      <aside className="sidebar">
        <div className="sidebar-brand">Admin Panel</div>
        <ul className="sidebar-nav">
          <li>
            <Link to="/admin/movies" className={location.pathname.startsWith('/movies') ? 'active' : ''}>
              Quản Lý Phim
            </Link>
          </li>
          <li>
            <Link to="/admin/episodes" className={location.pathname.startsWith('/episodes') ? 'active' : ''}>
              Quản Lý Tập Phim
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={location.pathname.startsWith('/users') ? 'active' : ''}>
              Quản Lý Người Dùng
            </Link>
          </li>
          <li>
            <Link to="/admin/comments" className={location.pathname.startsWith('/comments') ? 'active' : ''}>
              Quản Lý Bình Luận
            </Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>Xin chào, <strong>{user?.username}</strong></div>
          <button className="btn-logout" onClick={() => dispatch(logout())}>
            Đăng xuất
          </button>
        </header>

        <section className="content-body">
          {children}
        </section>
      </main>
    </div>
  );
};