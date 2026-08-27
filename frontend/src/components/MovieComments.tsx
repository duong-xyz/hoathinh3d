import React, { useEffect, useState } from 'react';
import { commentApi } from '../api/commentApi';
import { useAppSelector } from '../store/store';
import { getReactionIcon } from '../utils/reactionHelper';
import type { CommentResponse } from '../types/comment';

interface MovieCommentsProps {
  movieId: number;
}

export const MovieComments: React.FC<MovieCommentsProps> = ({ movieId }) => {
  const { user } = useAppSelector((state) => state.auth);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Dynamic States cho Trả lời (Reply) & Sửa (Edit)
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // Lưu Map câu trả lời theo comment cha: { [parentId]: CommentResponse[] }
  const [repliesMap, setRepliesMap] = useState<Record<number, CommentResponse[]>>({});

  const fetchRootComments = async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const res = await commentApi.getRootComments(movieId, user?.id, pageNum, 10);
      const newComments = res.data.content;
      setComments((prev) => (append ? [...prev, ...newComments] : newComments));
      setHasMore(!res.data.page || pageNum + 1 < res.data.page.totalPages);
    } catch (err) {
      console.error('Lỗi tải bình luận:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      setPage(0);
      fetchRootComments(0, false);
    }
  }, [movieId]);

  // Tạo comment gốc mới
  const handleCreateRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Vui lòng đăng nhập để bình luận!');
    if (!content.trim()) return;

    try {
      const res = await commentApi.createComment(user.id, {
        movieId,
        content: content.trim(),
      });
      setComments([res.data, ...comments]);
      setContent('');
    } catch (err) {
      console.error('Lỗi gửi bình luận:', err);
    }
  };

  // Tạo câu trả lời (Reply)
  const handleCreateReply = async (parentId: number) => {
    if (!user) return alert('Vui lòng đăng nhập để bình luận!');
    if (!replyContent.trim()) return;

    try {
      const res = await commentApi.createComment(user.id, {
        movieId,
        parentId,
        content: replyContent.trim(),
      });

      // Cập nhật danh sách replies lồng ghép
      setRepliesMap((prev) => ({
        ...prev,
        [parentId]: [...(prev[parentId] || []), res.data],
      }));

      // Tăng số lượng replyCount ở comment cha
      setComments((prev) =>
        prev.map((c) => (c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c))
      );

      setReplyContent('');
      setReplyingToId(null);
    } catch (err) {
      console.error('Lỗi gửi phản hồi:', err);
    }
  };

  // Tải danh sách replies của 1 comment
  const handleFetchReplies = async (parentId: number) => {
    try {
      const res = await commentApi.getReplies(parentId, user?.id, 0, 5);
      setRepliesMap((prev) => ({
        ...prev,
        [parentId]: res.data.content,
      }));
    } catch (err) {
      console.error('Lỗi tải phản hồi:', err);
    }
  };

  // Cập nhật bình luận
  const handleUpdate = async (commentId: number) => {
    if (!user || !editContent.trim()) return;
    try {
      await commentApi.updateComment(commentId, user.id, { content: editContent.trim() });

      // Update local comment gốc
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editContent.trim() } : c))
      );

      // Update local replies
      setRepliesMap((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((pId) => {
          const numericPId = Number(pId);
          updated[numericPId] = updated[numericPId].map((r) =>
            r.id === commentId ? { ...r, content: editContent.trim() } : r
          );
        });
        return updated;
      });

      setEditingId(null);
      setEditContent('');
    } catch (err) {
      console.error('Lỗi cập nhật bình luận:', err);
    }
  };

  // Xóa bình luận
  const handleDelete = async (commentId: number, parentId?: number | null) => {
    if (!user || !window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await commentApi.deleteComment(commentId, user.id);

      if (!parentId) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        setRepliesMap((prev) => ({
          ...prev,
          [parentId]: (prev[parentId] || []).filter((r) => r.id !== commentId),
        }));
        setComments((prev) =>
          prev.map((c) => (c.id === parentId ? { ...c, replyCount: Math.max(0, c.replyCount - 1) } : c))
        );
      }
    } catch (err) {
      console.error('Lỗi xóa bình luận:', err);
    }
  };

  return (
    <div className="comments-section" style={{ marginTop: '30px', color: '#fff' }}>
      <h3>Bình Luận</h3>

      {/* Form viết comment gốc */}
      {user ? (
        <form onSubmit={handleCreateRootComment} style={{ marginBottom: '20px', marginTop: '10px' }}>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
            Gửi Bình Luận
          </button>
        </form>
      ) : (
        <p style={{ color: '#94a3b8', margin: '10px 0' }}>Vui lòng đăng nhập để tham gia bình luận.</p>
      )}

      {/* Danh sách bình luận */}
      <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {comments.map((item) => (
          <div key={item.id} style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.user.avatarUrl ? (
                  <img src={item.user.avatarUrl} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {item.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <strong>{item.user.username}</strong>
              </div>
              <small style={{ color: '#64748b' }}>{new Date(item.createdAt).toLocaleString('vi-VN')}</small>
            </div>

            {/* Nội dung hoặc Form sửa */}
            {editingId === item.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: '#1e293b', color: '#fff', borderRadius: '4px' }}
                />
                <button className="btn-primary" style={{ fontSize: '12px', marginRight: '6px' }} onClick={() => handleUpdate(item.id)}>Lưu</button>
                <button className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => setEditingId(null)}>Hủy</button>
              </div>
            ) : (
              <p style={{ margin: '6px 0', color: '#e2e8f0' }}>{item.content}</p>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8', marginTop: '8px', alignItems: 'center' }}>
              <span style={{ color: item.currentUserReaction ? '#38bdf8' : 'inherit' }}>
                {getReactionIcon(item.currentUserReaction)} {item.reactionCount}
              </span>

              {user && (
                <span style={{ cursor: 'pointer', color: '#38bdf8' }} onClick={() => setReplyingToId(replyingToId === item.id ? null : item.id)}>
                  Trả lời
                </span>
              )}

              {user && user.id === item.user.id && (
                <>
                  <span style={{ cursor: 'pointer', color: '#38bdf8' }} onClick={() => { setEditingId(item.id); setEditContent(item.content); }}>
                    Sửa
                  </span>
                  <span style={{ cursor: 'pointer', color: '#f43f5e' }} onClick={() => handleDelete(item.id)}>
                    Xóa
                  </span>
                </>
              )}
            </div>

            {/* Form Trả lời */}
            {replyingToId === item.id && (
              <div style={{ marginTop: '10px', paddingLeft: '16px' }}>
                <textarea
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Trả lời ${item.user.username}...`}
                  style={{ width: '100%', padding: '8px', background: '#1e293b', color: '#fff', borderRadius: '4px' }}
                />
                <button className="btn-primary" style={{ fontSize: '12px', marginTop: '4px', marginRight: '6px' }} onClick={() => handleCreateReply(item.id)}>
                  Gửi Phản Hồi
                </button>
                <button className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => setReplyingToId(null)}>
                  Hủy
                </button>
              </div>
            )}

            {/* Nút Xem Phản Hồi */}
            {item.replyCount > 0 && !repliesMap[item.id] && (
              <button
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}
                onClick={() => handleFetchReplies(item.id)}
              >
                — Xem {item.replyCount} câu trả lời
              </button>
            )}

            {/* Danh sách Replies */}
            {repliesMap[item.id] && (
              <div style={{ marginLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid #334155', paddingLeft: '12px' }}>
                {repliesMap[item.id].map((reply) => (
                  <div key={reply.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px' }}>{reply.user.username}</strong>
                      <small style={{ color: '#64748b' }}>{new Date(reply.createdAt).toLocaleString('vi-VN')}</small>
                    </div>

                    {editingId === reply.id ? (
                      <div>
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} style={{ width: '100%', padding: '6px', background: '#1e293b', color: '#fff' }} />
                        <button className="btn-primary" style={{ fontSize: '11px' }} onClick={() => handleUpdate(reply.id)}>Lưu</button>
                        <button className="btn-secondary" style={{ fontSize: '11px', marginLeft: '4px' }} onClick={() => setEditingId(null)}>Hủy</button>
                      </div>
                    ) : (
                      <p style={{ margin: '4px 0', fontSize: '14px', color: '#cbd5e1' }}>{reply.content}</p>
                    )}

                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
                      <span>{getReactionIcon(reply.currentUserReaction)} {reply.reactionCount}</span>
                      {user && user.id === reply.user.id && (
                        <>
                          <span style={{ cursor: 'pointer', color: '#38bdf8' }} onClick={() => { setEditingId(reply.id); setEditContent(reply.content); }}>Sửa</span>
                          <span style={{ cursor: 'pointer', color: '#f43f5e' }} onClick={() => handleDelete(reply.id, item.id)}>Xóa</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          className="btn-secondary"
          style={{ marginTop: '16px', width: '100%' }}
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchRootComments(nextPage, true);
          }}
        >
          {loading ? 'Đang tải...' : 'Xem thêm bình luận'}
        </button>
      )}
    </div>
  );
};