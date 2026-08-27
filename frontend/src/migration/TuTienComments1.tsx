import React, { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentHeader from './CommentHeader';
import { initialComments1, type ReplyItemType } from '../utils/reactionHelper';
import RenderCommentContent from './RenderCommentContent';
import { handleAddVotes1 } from '../utils/reactionHelper'
import ReplyItem from './ReplyItem';
import CommentItem from './CommentItem2';
import { commentApi } from '../api/commentApi';
import type { CommentResponse } from '../types/comment';
import { useAppSelector } from '../store/store';
import { useParams } from 'react-router-dom';

const TuTienComments = ({ setIsOpen, setOnSelectStickerCallback, onOpenPopup, onClosePopup, onInit }: any) => {
  const [comments, setComments] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const movieId = useParams<{ id: string }>().id;
  const [repliesMap, setRepliesMap] = useState<Record<number | string, ReplyItemType[]>>({});

  const fetchRootComments = async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const res = await commentApi.getRootComments(Number(movieId), user?.id, pageNum, 10);
      console.log("err:", res);

      const newComments: CommentResponse[] = res.data.content;
      const mergedComments = newComments.map((apiItem) => {
        return {
          ...initialComments1[0],
          id: String(apiItem.id),
          text: apiItem.content,
          votes: apiItem.reactionCount,
          date: apiItem.createdAt,
          author: apiItem.user.username,
          userId: String(apiItem.user.id),
          avatar: apiItem.user.avatarUrl || "",
          replies: [],
          replyCount: apiItem.replyCount
        };
      });
      setComments((prev: any) => (append ? [...prev, ...mergedComments] : mergedComments));
    } catch (err) {
      console.error('Lỗi tải bình luận:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchRootComments(0, false);
      console.log("kkkkk", comments);

    }
  }, [movieId]);

  // Hàm map 1 item reply từ API đè lên khung mẫu
  const mapReplyItem = (apiReply: CommentResponse, parentUser?: any): ReplyItemType => {
    const replyTemplate = initialComments1[0].replies[0];
    return {
      ...replyTemplate, // 1. Bê toàn bộ giao diện/UI mẫu của Reply
      id: String(apiReply.id),
      text: apiReply.content,
      votes: apiReply.reactionCount,
      date: apiReply.createdAt,
      fullDate: apiReply.createdAt,
      author: apiReply.user?.username || replyTemplate.author,
      userId: String(apiReply.user?.id || ""),
      avatar: apiReply.user?.avatarUrl || replyTemplate.avatar,

      // 2. Ghi đè thông tin người được trả lời (replyTo)
      replyTo: parentUser ? {
        ...replyTemplate.replyTo,
        id: String(parentUser.id),
        author: parentUser.username,
      } : replyTemplate.replyTo,

      // 3. Nếu reply này có chứa reply con cấp sâu hơn
      replies: (apiReply as any).replies
        ? (apiReply as any).replies.map((subReply: any) => mapReplyItem(subReply, apiReply.user))
        : []
    } as ReplyItemType;
  };

  const handleFetchReplies = async (parentId: number) => {
    try {
      const res = await commentApi.getReplies(parentId, user?.id, 0, 5);
      const apiReplies: CommentResponse[] = res.data.content;
      const parentComment = comments.find((c: any) => String(c.id) === String(parentId));

      // Map danh sách câu trả lời theo mẫu
      const mergedReplies: ReplyItemType[] = apiReplies.map((reply) =>
        mapReplyItem(reply, parentComment)
      );

      // Set state không bị báo lỗi Type
      setRepliesMap((prev) => ({
        ...prev,
        [parentId]: mergedReplies,
      }));
    } catch (err) {
      console.error('Lỗi tải phản hồi:', err);
    }
  };

  const handleCreateRootComment = async (e: React.SubmitEvent<HTMLFormElement>, content: string) => {
    e.preventDefault();
    if (!user) return alert('Vui lòng đăng nhập để bình luận!');
    if (!content.trim()) return;

    try {
      const res = await commentApi.createComment(user.id, {
        movieId: Number(movieId),
        content: content.trim(),
      });

      const apiComment = res.data;
      const commentTemplate = initialComments1[0]; // Lấy khung mẫu UI

      // 1. Chuẩn hóa comment mới bằng cách đè dữ liệu lên template
      const newFormattedComment = {
        ...commentTemplate,
        id: String(apiComment.id),
        text: apiComment.content || content.trim(),
        votes: apiComment.reactionCount || 0,
        date: 'Vừa xong',
        fullDate: apiComment.createdAt,

        // Ưu tiên lấy thông tin từ state user hiện tại để tránh bị undefined từ API
        author: apiComment.user?.username,
        userId: String(user.id),
        avatar: apiComment.user.avatarUrl,
      };

      // 2. Cập nhật State bằng functional update để tránh lỡ state cũ
      setComments((prev:any) => [newFormattedComment, ...prev]);

    } catch (err) {
      console.error('Lỗi gửi bình luận:', err);
    }
  };

  const handleAddComment = (newComment: any) => {
    setComments((prevComments: any) => [newComment, ...prevComments]);
  };

  const handleToggleReply = (commentId: any) => {
    setComments((prevComments: any) => {
      const toggleRecursive = (items: any) => {
        if (!items || items.length === 0) return [];

        return items.map((item: any) => {
          if (item.id === commentId) {
            return { ...item, isReply: !item.isReply };
          }

          if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: toggleRecursive(item.replies)
            };
          }

          return item;
        });
      };

      return toggleRecursive(prevComments);
    });
  };
  const handleMouseEnter = (e: any, id: any) => {
    if (onOpenPopup) {
      const rect = e.currentTarget.getBoundingClientRect();
      onOpenPopup(rect, id);
    }
  };

  const handleMouseLeave = () => {
    if (onClosePopup) {
      onClosePopup();
    }
  };
  const onVote = (selectedReaction: any, commentId: any) => {
    handleAddVotes1(selectedReaction, commentId, setComments);
  };
  useEffect(() => {
    if (onInit) onInit(onVote);
  }, [onInit]);

  return (
    <div id="info-v2-comments" className="info-v2-comments ah-frame-bg">
      <div id="comments" className="comments-area">
        <div id="wpdcom" className="wpdiscuz_auth wpd-dark wpd-layout-1 wpd-comments-open wv-reactions-on">

          <div className="wpd-form-wrap">
            <div className="wpd-form-head">
              <div className="wpd-auth">
                <div className="wpd-login">
                  <a
                    rel="nofollow"
                    href="#"
                  >
                    <i className="fas fa-sign-in-alt" /> Đăng nhập để bình luận
                  </a>
                </div>
              </div>
            </div>

            <CommentForm handleCreateRootComment={handleCreateRootComment} setIsOpen={setIsOpen} setOnSelectStickerCallback={setOnSelectStickerCallback} onAddComment={handleAddComment} />
          </div>

          <div id="wpd-threads" className="wpd-thread-wrapper">
            <CommentHeader />

            <div className="wpd-comment-info-bar">
              <div className="wpd-current-view">
                <i className="fas fa-quote-left" aria-hidden="true" /> Phản hồi nội tuyến
              </div>
              <div className="wpd-filter-view-all">Xem tất cả bình luận</div>
            </div>

            <div className="wpd-thread-list">
              {comments.map((comment: any) => {
                console.log("vl:", comment);

                return (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    setComments={setComments}
                    setIsOpen={setIsOpen}
                    setOnSelectStickerCallback={setOnSelectStickerCallback}
                    handleAddComment={handleAddComment}
                    handleToggleReply={handleToggleReply}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleAddVotes1={handleAddVotes1}
                    repliesMap={repliesMap}
                    RenderCommentContent={RenderCommentContent}
                    CommentForm={CommentForm}
                    ReplyItem={ReplyItem}
                    handleFetchReplies={handleFetchReplies}
                  />
                );
              })}


            </div>

          </div>
        </div>
      </div>
      {/* ring modal */}
      <div
        className="ring-modal"
        id="ring-modal-60860"
        style={{ display: "none" }}
      >
        <div className="ring-modal-content">
          <span className="close-modal" onClick={e => { const m = e.currentTarget.closest('.ring-modal') as HTMLElement; m && (m.classList.remove('active'), m.style.display = 'none') }}>
            <i className="fas fa-times" />
          </span>
          <div className="ring-image-container">
            <div className="ring-image-wrapper">
              <img
                src="/stickers/vinh-da-minh-chau.png"
                alt="Nhẫn"
                className="ring-modal-image"
              />
            </div>
            <span
              className="ring-bubble"
              id="ring-bubble-60860"
              style={{ display: "none" }}
            >
              Vĩnh Dạ Minh Châu
            </span>
          </div>
          <div className="user-info-section">
            <div className="user-avatars-couple">
              <div className="avatar-left-couple">
                <div className="avatar-frame-wrapper-couple">
                  <a href="/profile/60860" target="_blank">
                    <div className="avatar-container-couple khung_vip_2 avatar-padding">
                      <img
                        src="/stickers/avatar_1.jpeg"
                        alt="Kinosaki Mei Ი𐑼"
                        className="user-avatar-couple"
                      />
                    </div>
                  </a>
                </div>
                <p className="user-name-rings color_hu_dao">Kinosaki Mei Ი𐑼</p>
              </div>
              <div className="avatar-right-couple">
                <div className="avatar-frame-wrapper-couple">
                  <a href="/profile/181405" target="_blank">
                    <div className="avatar-container-couple top_1_dua_top_tm avatar-padding">
                      <img
                        src="/stickers/ny.jpg"
                        alt="我是 nywhs ෆ"
                        className="user-avatar-couple"
                      />
                    </div>
                  </a>
                </div>
                <p className="user-name-rings color_hoa_ma">我是 nywhs ෆ</p>
              </div>
            </div>
            <div className="couple-info-section">
              <p className="couple-name">Chày Gông ~ Vẹt Lớ ♡⁠</p>
              <p className="couple-info">Chưa có thông tin giới thiệu</p>
            </div>
            <div className="partnership-details">
              <p className="partnership-time">
                <i className="fas fa-heart" /> Đã kết đạo lữ: 65 ngày
              </p>
              <p className="partnership-order">
                <i className="fas fa-kiss-wink-heart" /> Số đăng ký Nguyệt Lão: 2186
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* hồng nhan modal */}
      <div className="hn-modal" id="hn-modal-156392" style={{ display: "none" }}>
        <div className="hnm-panel">
          <button className="hnm-close" onClick={e => { const m = e.currentTarget.closest('.hn-modal') as HTMLElement; m && (m.style.display = 'none') }}>
            ×
          </button>
          <div className="hnm-header">
            <img
              src="/stickers/diep-linh-gioi.webp"
              alt="Hồng Nhan"
              className="hnm-ring-img"
            />
            <div className="hnm-nc hnm-nc--viewed">
              <a href="/profile/156392" target="_blank">
                <div className="avatar-frame-wrapper-couple">
                  <div className="avatar-container-couple khung_vip_2 avatar-padding">
                    <img
                      src="/stickers/avatar_1.jpeg"
                      alt=""
                      className="user-avatar-couple"
                    />
                  </div>
                </div>
              </a>
              <span className="hnm-nc-name">
                <span className="vip-username-vip-6-month">ღLong Gia Gia𓆤</span>
              </span>
            </div>
          </div>
          <div className="hnm-divider">
            <span>✦ Hồng Nhan (1) ✦</span>
          </div>
          <div className="hnm-grid">
            <div className="hnm-card">
              <span className="hnm-slot">1</span>
              <a href="/profile/150465" target="_blank">
                <div className="avatar-frame-wrapper-couple">
                  <div className="avatar-container-couple khung_vip_2 avatar-padding">
                    <img
                      src="/stickers/70781.webp"
                      alt=""
                      className="user-avatar-couple"
                    />
                  </div>
                </div>
              </a>
              <span className="hnm-card-name">
                <span className="vip-username-12-month">ᴘɴ ღ亗 ɕɦσɕσρıε</span>
                <span className="vip-icon-12-month" />
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TuTienComments;
