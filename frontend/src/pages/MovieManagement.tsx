import React, { useEffect, useState } from 'react';
import { movieApi } from '../api/movieApi';
import { useAppSelector } from '../store/store';
import { AdminLayout } from '../layout/AdminLayout';
import type {
  Page,
  MovieResponseDto,
  MovieDetailResponseAdDto,
  MovieCreateRequest,
  MovieUpdateRequest,
} from '../types/movie';
import { ScheduleUtils, DAYS_CONFIG } from '../utils/scheduleUtil';

export const MovieManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role.includes('ROLE_ADMIN');

  const [moviePage, setMoviePage] = useState<Page<MovieResponseDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailResponseAdDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<number | undefined>(undefined);

  const [formData, setFormData] = useState<MovieCreateRequest>({
    title: '',
    originalTitle: '',
    type: 'SERIES',
    description: '',
    thumbnailUrl: '',
    schedule: '',
  });

  const [formData1, setFormData1] = useState<MovieUpdateRequest>({
    title: '',
    originalTitle: '',
    type: undefined,
    ratingScore: 0,
    thumbnailUrl: '',
    schedule: '',
    description: '',
  });

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const res = await movieApi.getAllMovies(page);
      setMoviePage(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phim:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handleViewDetail = async (id: number) => {
    try {
      const res = await movieApi.getMovieByIdForAd(id);
      setSelectedMovie(res.data);
    } catch (err) {
      console.error('Lỗi tải chi tiết phim:', err);
    }
  };

  const handleOpenUpdateModal = async (id: number) => {
    try {
      const res = await movieApi.getMovieByIdForAd(id);
      const movie = res.data;
      setFormData1({
        title: movie.title || '',
        originalTitle: movie.originalTitle || '',
        type: movie.type,
        ratingScore: movie.ratingScore || 0,
        thumbnailUrl: movie.thumbnailUrl || '',
        schedule: movie.schedule || '',
        description: movie.description || '',
      });
      setShowUpdateModal(id);
    } catch (err) {
      console.error('Lỗi tải dữ liệu phim để cập nhật:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phim này?')) return;
    try {
      await movieApi.deleteMovie(id);
      fetchMovies(currentPage);
    } catch (err) {
      console.error('Xóa phim thất bại:', err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>, modal: number | undefined) => {
    e.preventDefault();
    if (modal === undefined) {
      try {
        await movieApi.createMovie(formData);
        setShowCreateModal(false);
        setFormData({
          title: '',
          originalTitle: '',
          type: 'SERIES',
          description: '',
          thumbnailUrl: '',
          schedule: '',
        });
        fetchMovies(0);
      } catch (err) {
        console.error('Tạo phim thất bại:', err);
      }
    } else {
      try {
        await movieApi.updateMovie(modal, formData1);
        setShowUpdateModal(undefined);
        setFormData1({
          title: '',
          originalTitle: '',
          type: undefined,
          ratingScore: 0,
          thumbnailUrl: '',
          schedule: '',
          description: '',
        });
        fetchMovies(currentPage);
      } catch (err) {
        console.error('Cập nhật phim thất bại:', err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="header-actions">
        <h2>Quản Lý Phim</h2>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Thêm Phim
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Phim</th>
              <th>Tên Gốc</th>
              <th>Loại Phim</th>
              <th>Lịch Chiếu</th>
              <th>Đánh Giá</th>
              <th style={{ textAlign: 'right' }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : (
              moviePage?.content.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.title}</td>
                  <td>{movie.originalTitle || 'N/A'}</td>
                  <td>{movie.type === 'SINGLE' ? 'Phim Lẻ' : 'Phim Bộ'}</td>
                  <td>{ScheduleUtils.toHumanReadable(movie.schedule)}</td>
                  <td>{movie.ratingScore ?? 'Chưa có'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-link" onClick={() => handleViewDetail(movie.id)}>
                      Xem Chi Tiết
                    </button>
                    <button className="btn-link" onClick={() => handleOpenUpdateModal(movie.id)}>
                      Sửa
                    </button>
                    <button className="btn-link danger" onClick={() => handleDelete(movie.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {moviePage && (
          <div className="pagination">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Trang trước
            </button>
            <span>
              Trang {moviePage.page.number + 1} / {moviePage.page.totalPages}
            </span>
            <button
              disabled={currentPage + 1 >= moviePage.page.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '550px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>Chi Tiết Phim (Admin)</h3>
            <br />
            <p><strong>ID:</strong> {selectedMovie.id}</p>
            <p><strong>Tên phim:</strong> {selectedMovie.title}</p>
            <p><strong>Tên gốc:</strong> {selectedMovie.originalTitle || 'N/A'}</p>
            <p><strong>Loại:</strong> {selectedMovie.type === 'SINGLE' ? 'Phim Lẻ' : 'Phim Bộ'}</p>
            <p><strong>Đánh giá:</strong> {selectedMovie.ratingScore ?? 'Chưa có'}</p>
            <p><strong>Lịch chiếu:</strong> {selectedMovie.schedule || 'N/A'}</p>

            <br />
            <h4>Danh Sách Tập Phim ({selectedMovie.episodes?.length || 0})</h4>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedMovie.episodes && selectedMovie.episodes.length > 0 ? (
                selectedMovie.episodes.map((ep) => (
                  <div key={ep.id} style={{ border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px' }}>
                    <strong>Tập {ep.episodeNumber}: {ep.title || 'Không có tiêu đề'}</strong>

                    <div style={{ marginTop: '6px', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>Nguồn phát ({ep.sources?.length || 0}):</span>
                      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                        {ep.sources && ep.sources.length > 0 ? (
                          ep.sources.map((src) => (
                            <li key={src.id}>
                              [{src.serverName}] <a href={src.sourceURL} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>Xem Server</a>
                            </li>
                          ))
                        ) : (
                          <li style={{ color: '#94a3b8' }}>Chưa có server phát nào</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b' }}>Chưa có tập phim nào</p>
              )}
            </div>

            <br />
            <button className="btn-secondary" onClick={() => setSelectedMovie(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={e => handleCreateSubmit(e, undefined)}>
            <h3>Thêm Phim Mới</h3>
            <br />
            <div className="form-group">
              <label>Tên phim</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tên gốc (Original Title)</label>
              <input
                type="text"
                value={formData.originalTitle}
                onChange={(e) => setFormData({ ...formData, originalTitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Loại phim</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="SERIES">Phim Bộ (SERIES)</option>
                <option value="SINGLE">Phim Lẻ (SINGLE)</option>
              </select>
            </div>
            {/* Create Modal - Lịch chiếu */}
            {(() => {
  const { time, normalBitmask, earlyBitmask } = ScheduleUtils.parse(formData.schedule);

  return (
    <div className="schedule-picker-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>
      {/* 1. CHỌN GIỜ CHIẾU */}
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Giờ Chiếu Chấm Định Kỳ
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => {
            setFormData({
              ...formData,
              schedule: ScheduleUtils.format(e.target.value, normalBitmask, earlyBitmask),
            });
          }}
          style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {/* 2. CHỌN NHIỀU NGÀY CHIẾU CHÍNH (NORMAL) */}
      <div>
        <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>
          Lịch Chiếu Chính (Chính Thức):
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DAYS_CONFIG.map((day) => {
            const isChecked = ScheduleUtils.isDaySelected(normalBitmask, day.bit);
            return (
              <label
                key={`normal-${day.bit}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  padding: '4px 8px',
                  background: isChecked ? '#e0f2fe' : '#f8fafc',
                  border: `1px solid ${isChecked ? '#0284c7' : '#cbd5e1'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const newNormalBitmask = ScheduleUtils.toggleDayBit(normalBitmask, day.bit);
                    setFormData({
                      ...formData,
                      schedule: ScheduleUtils.format(time, newNormalBitmask, earlyBitmask),
                    });
                  }}
                />
                {day.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. CHỌN NHIỀU NGÀY CHIẾU SỚM (EARLY ACCESS) */}
      <div>
        <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px', color: '#b45309' }}>
          Lịch Chiếu Sớm (Suất Chiếu Sớm):
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DAYS_CONFIG.map((day) => {
            const isChecked = ScheduleUtils.isDaySelected(earlyBitmask, day.bit);
            return (
              <label
                key={`early-${day.bit}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  padding: '4px 8px',
                  background: isChecked ? '#fef3c7' : '#f8fafc',
                  border: `1px solid ${isChecked ? '#d97706' : '#cbd5e1'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const newEarlyBitmask = ScheduleUtils.toggleDayBit(earlyBitmask, day.bit);
                    setFormData({
                      ...formData,
                      schedule: ScheduleUtils.format(time, normalBitmask, newEarlyBitmask),
                    });
                  }}
                />
                {day.label}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
})()}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Hủy
              </button>
              <button type="submit" className="btn-primary">
                Tạo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={e => handleCreateSubmit(e, showUpdateModal)}>
            <h3>Cập Nhật Phim</h3>
            <br />
            <div className="form-group">
              <label>Tên phim</label>
              <input
                type="text"
                required
                value={formData1.title}
                onChange={(e) => setFormData1({ ...formData1, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tên gốc (Original Title)</label>
              <input
                type="text"
                value={formData1.originalTitle}
                onChange={(e) => setFormData1({ ...formData1, originalTitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Loại phim</label>
              <select
                value={formData1.type}
                onChange={(e) => setFormData1({ ...formData1, type: e.target.value as any })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="SERIES">Phim Bộ (SERIES)</option>
                <option value="SINGLE">Phim Lẻ (SINGLE)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Điểm đánh giá</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData1.ratingScore}
                onChange={(e) => setFormData1({ ...formData1, ratingScore: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input
                type="text"
                value={formData1.thumbnailUrl}
                onChange={(e) => setFormData1({ ...formData1, thumbnailUrl: e.target.value })}
              />
            </div>
            {/* <div className="form-group">
              <label>Lịch chiếu</label>
              <input
                type="text"
                value={formData1.schedule}
                onChange={(e) => setFormData1({ ...formData1, schedule: e.target.value })}
              />
            </div> */}
            {/* Update Modal - Lịch chiếu */}
            {(() => {
  const { time, normalBitmask, earlyBitmask } = ScheduleUtils.parse(formData1.schedule);

  return (
    <div className="schedule-picker-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>
      {/* 1. CHỌN GIỜ CHIẾU */}
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Giờ Chiếu Chấm Định Kỳ
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => {
            setFormData1({
              ...formData1,
              schedule: ScheduleUtils.format(e.target.value, normalBitmask, earlyBitmask),
            });
          }}
          style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {/* 2. CHỌN NHIỀU NGÀY CHIẾU CHÍNH */}
      <div>
        <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>
          Lịch Chiếu Chính (Chính Thức):
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DAYS_CONFIG.map((day) => {
            const isChecked = ScheduleUtils.isDaySelected(normalBitmask, day.bit);
            return (
              <label
                key={`normal-update-${day.bit}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  padding: '4px 8px',
                  background: isChecked ? '#e0f2fe' : '#f8fafc',
                  border: `1px solid ${isChecked ? '#0284c7' : '#cbd5e1'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const newNormalBitmask = ScheduleUtils.toggleDayBit(normalBitmask, day.bit);
                    setFormData1({
                      ...formData1,
                      schedule: ScheduleUtils.format(time, newNormalBitmask, earlyBitmask),
                    });
                  }}
                />
                {day.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. CHỌN NHIỀU NGÀY CHIẾU SỚM */}
      <div>
        <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px', color: '#b45309' }}>
          Lịch Chiếu Sớm (Suất Chiếu Sớm):
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DAYS_CONFIG.map((day) => {
            const isChecked = ScheduleUtils.isDaySelected(earlyBitmask, day.bit);
            return (
              <label
                key={`early-update-${day.bit}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  padding: '4px 8px',
                  background: isChecked ? '#fef3c7' : '#f8fafc',
                  border: `1px solid ${isChecked ? '#d97706' : '#cbd5e1'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const newEarlyBitmask = ScheduleUtils.toggleDayBit(earlyBitmask, day.bit);
                    setFormData1({
                      ...formData1,
                      schedule: ScheduleUtils.format(time, normalBitmask, newEarlyBitmask),
                    });
                  }}
                />
                {day.label}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
})()}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={formData1.description}
                onChange={(e) => setFormData1({ ...formData1, description: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowUpdateModal(undefined)}>
                Hủy
              </button>
              <button type="submit" className="btn-primary">
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};