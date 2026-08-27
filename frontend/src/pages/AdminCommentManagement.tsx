import React, { useEffect, useState } from 'react';
import { movieApi } from '../api/movieApi';
import { commentApi } from '../api/commentApi';
import { useAppSelector } from '../store/store';
import { AdminLayout } from '../layout/AdminLayout';
import type { MovieResponseDto } from '../types/movie';
import type { CommentResponse } from '../types/comment';

export const AdminCommentManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [movies, setMovies] = useState<MovieResponseDto[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await movieApi.getAllMovies(0, 100);
        setMovies(res.data.content);
        if (res.data.content.length > 0) {
          setSelectedMovieId(res.data.content[0].id);
        }
      } catch (err) {
        console.error('Lỗi tải danh sách phim:', err);
      }
    };
    fetchMovies();
  }, []);

  const fetchComments = async (movieId: number, pageNum: number) => {
    setLoading(true);
    try {
      const res = await commentApi.getRootComments(movieId, user?.id, pageNum, 10);
      setComments(res.data.content);
      if (res.data.page) {
        setTotalPages(res.data.page.totalPages);
      }
    } catch (err) {
      console.error('Lỗi tải bình luận:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMovieId) {
      setPage(0);
      fetchComments(selectedMovieId, 0);
    }
  }, [selectedMovieId]);

  const handleDelete = async (commentId: number) => {
    if (!user || !window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      await commentApi.deleteComment(commentId, user.id);
      if (selectedMovieId) fetchComments(selectedMovieId, page);
    } catch (err) {
      console.error('Lỗi xóa bình luận:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="header-actions">
        <h2>Quản Lý Bình Luận Phim</h2>
      </div>

      <div style={{ marginBottom: '20px', background: 'white', padding: '16px', borderRadius: '8px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Chọn Phim:</label>
        <select
          value={selectedMovieId ?? ''}
          onChange={(e) => setSelectedMovieId(Number(e.target.value))}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
        >
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              [{m.id}] {m.title}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Nội dung</th>
              <th>Lượt thích</th>
              <th>Phản hồi</th>
              <th>Thời gian</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : comments.length > 0 ? (
              comments.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.user.username}</strong></td>
                  <td style={{ maxWidth: '350px' }}>{c.content}</td>
                  <td>👍 {c.reactionCount}</td>
                  <td>💬 {c.replyCount}</td>
                  <td>{new Date(c.createdAt).toLocaleString('vi-VN')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-link danger" onClick={() => handleDelete(c.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>Không có bình luận nào cho phim này</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button disabled={page === 0} onClick={() => { const p = page - 1; setPage(p); if (selectedMovieId) fetchComments(selectedMovieId, p); }}>
            Trang trước
          </button>
          <span>Trang {page + 1} / {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={() => { const p = page + 1; setPage(p); if (selectedMovieId) fetchComments(selectedMovieId, p); }}>
            Trang sau
          </button>
        </div>
      )}
    </AdminLayout>
  );
};