import React, { type FC, type MouseEvent } from 'react';
import RenderCommentContent from './RenderCommentContent';
import CommentForm from './CommentForm';

export interface Flag {
  name: string;
  src: string;
  width?: number;
}

export interface ReplyToUser {
  id: string | number;
  author: string;
  clanBadge?: string;
  clanName?: string;
  flags?: Flag[];
  sect?: string;
  sectUrl?: string;
  sectRole?: string;
}

export interface ReplyData {
  id: string | number;
  author: string;
  avatar?: string;
  avatarFrameClass?: string;
  realm?: string;
  text: string;
  date?: string;
  fullDate?: string;
  reactionType?: string;
  votes?: number;
  isReply?: boolean;
  replyTo?: ReplyToUser;
  replies?: ReplyData[];
}

export interface NextReplyHandler {
  setIsOpen: (isOpen: boolean) => void;
  setOnSelectStickerCallback: (callback: (sticker: string) => void) => void;
  handleAddComment: (commentData: unknown) => void;
}

export interface ReplyItemProps {
  reply: ReplyData;
  parentId: string | number;
  onMouseEnter?: (e: MouseEvent<HTMLElement>, id: string | number) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
  onVote?: (id: string | number, type: string) => void;
  onToggleReply?: (id: string | number) => void;
  nextReply?: NextReplyHandler;
}

// Bổ sung custom attributes cho JSX (wpd-tooltip)
declare module 'react' {
  interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    'wpd-tooltip'?: string;
    'wpd-tooltip-position'?: string;
    'wpd-tooltip-size'?: string;
  }
}

const ReplyItem: FC<ReplyItemProps> = ({
  reply,
  parentId,
  onMouseEnter,
  onMouseLeave,
  onVote,
  onToggleReply,
  nextReply
}) => {
  return (
    <div
      id={`wpd-comm-${reply.id}_${parentId}`}
      className="comment byuser even thread-even depth-1 wpd-comment wpd-reply wpd_comment_level-2"
    >
      <div className="wpd-comment-wrap wpd-blog-user wpd-blog-subscriber">
        {/* Khối bên trái: Avatar & Cảnh Giới */}
        <div className="wpd-comment-left">
          <div className={`wpd-avatar wcai-short-info wcai-not-clicked ${reply.avatarFrameClass || ''}`}>
            <img
              src={reply.avatar || "https://hoathinh3d.st/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg"}
              className="gravatar avatar avatar-64 um-avatar um-avatar-uploaded"
              width={64}
              height={64}
              alt={reply.author}
              data-default="https://hoathinh3d.st/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                if (!target.getAttribute('data-load-error')) {
                  target.setAttribute('data-load-error', '1');
                  target.src = target.getAttribute('data-default') || '';
                }
              }}
              loading="lazy"
            />
          </div>
          <div
            className="wpd-comment-label"
            wpd-tooltip={reply.realm || "Phàm Nhân"}
            wpd-tooltip-position="right"
          >
            <span>{reply.realm || "Phàm Nhân"}</span>
          </div>
        </div>

        {/* Khối bên phải: Header, Nội dung, Footer */}
        <div id={`comment-${reply.id}`} className="wpd-comment-right">
          {/* Header */}
          <div className="wpd-comment-header">
            <div className="wpd-comment-author wcai-uname-info wcai-not-clicked">
              {reply.author} <span className="bang-hoi" />
            </div>
            <div className="wpdiscuz-mycred-wrap" />
            <div className="wpd-comment-date" title={reply.fullDate || reply.date}>
              <i className="far fa-clock" aria-hidden="true" />
              {reply.date || "Vừa xong"}
            </div>
            <div className="wpd-space" />
            <div className="wpd-comment-link wpd-hidden">
              <span wpd-tooltip="Comment author information" wpd-tooltip-size="medium">
                <i
                  id={`wcai-comment_${reply.id}`}
                  className="fas fa-info wpf-cta wcai-info wcai-not-clicked"
                />
              </span>
              <span wpd-tooltip="Liên kết bình luận" wpd-tooltip-position="left">
                <i
                  className="fas fa-link"
                  aria-hidden="true"
                  data-wpd-clipboard={`#comment-${reply.id}`}
                />
              </span>
            </div>
          </div>

          {/* Người được trả lời (ReplyTo) */}
          {reply.replyTo && (
            <div className="wpd-reply-to">
              <i className="far fa-comments" /> Trả lời&nbsp;
              <a href={`#comment-${reply.replyTo.id}`}>
                {/* Huy hiệu Clan / Tộc */}
                {reply.replyTo.clanBadge && (
                  <span
                    className="custom-badge-tooltip"
                    tabIndex={0}
                    role="button"
                    aria-label={reply.replyTo.clanName}
                  >
                    <img src={reply.replyTo.clanBadge} alt="" width="35px" />
                    <span className="custom-badge-tooltiptext hh3d-badge-preview">
                      <img
                        src={reply.replyTo.clanBadge}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          width: "auto",
                          height: "auto",
                          maxHeight: "min(200px,42vh)"
                        }}
                      />
                      <span className="custom-badge-name">{reply.replyTo.clanName}</span>
                    </span>
                  </span>
                )}{" "}
                {reply.replyTo.author}{" "}
                {/* Cờ Tông */}
                {reply.replyTo.flags?.map((flag, idx) => (
                  <span key={idx} data-tooltip={flag.name}>
                    <img
                      src={flag.src}
                      alt={flag.name}
                      title={flag.name}
                      style={{ width: flag.width || 30, height: "auto", margin: "0px 2px 5px -5px" }}
                    />
                  </span>
                ))}
              </a>{" "}
              {/* Tông môn */}
              {reply.replyTo.sect && (
                <>
                  <a
                    href={reply.replyTo.sectUrl || "#"}
                    className="tong-link"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {reply.replyTo.sect}
                  </a>{" "}
                  <span data-tooltip={reply.replyTo.sectRole || "Ngoại Môn"} />
                </>
              )}
            </div>
          )}

          {/* Nội dung bình luận */}
          <RenderCommentContent content={reply.text} />

          {/* Footer Vote & Phản hồi */}
          <div className="wpd-comment-footer">
            <div className="wpd-vote">
              <div
                className={`wpd-vote-up wpd_not_clicked ${reply.reactionType ? "wv-has-user-reaction" : ""}`}
                onMouseEnter={(e) => onMouseEnter && onMouseEnter(e, reply.id)}
                onMouseLeave={onMouseLeave}
                onClick={(e) => onMouseEnter && onMouseEnter(e, reply.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0V0z" />
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                {reply.reactionType && (
                  <img
                    className="wv-vote-up__reaction"
                    src={`/stickers/${reply.reactionType}.svg`}
                    alt="Thích"
                    width={20}
                    height={20}
                    decoding="async"
                  />
                )}
              </div>
              {reply.reactionType && (
                <span
                  className="wv-reaction-summary wv-likers-hit"
                  role="button"
                  tabIndex={0}
                  title="Xem danh sách cảm xúc"
                  aria-label="Xem 1 lượt bình chọn"
                >
                  <span className="wv-reaction-summary__icons" aria-hidden="true">
                    <img
                      className="wv-reaction-summary__icon"
                      src={`/stickers/${reply.reactionType}.svg`}
                      alt="Thích"
                      width={18}
                      height={18}
                      loading="lazy"
                    />
                  </span>
                  <span className="wv-reaction-summary__count">1</span>
                </span>
              )}

              <div className="wpd-vote-result wv-like-hidden">{reply.votes || 0}</div>
              <div className="wpd-vote-down wpd_not_clicked wpd-dislike-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                </svg>
              </div>
            </div>

            <div className="wpd-reply-button" onClick={() => onToggleReply && onToggleReply(reply.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
              <span>Phản hồi</span>
            </div>
            <div className="wpd-space" />
            <div className="wpd-tools wpd-hidden" title="Quản lý bình luận">
              <i className="fas fa-cog" />
              <div className="wpd-tools-actions" style={{ display: "none" }}>
                <span className="wpd_editable_comment wpd-cta-button">Sửa</span>
                <span className="wpdiscuz-fem-delete-comment wpd-cta-button">Xóa bỏ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reply.isReply && nextReply && (
        <CommentForm
          setIsOpen={nextReply.setIsOpen}
          setOnSelectStickerCallback={nextReply.setOnSelectStickerCallback}
          onAddComment={nextReply.handleAddComment}
        />
      )}

      <div id={`wpdiscuz_form_anchor-${reply.id}_${parentId}`} />

      {/* --- ĐỆ QUY RENDER REPLIES CON TẠI ĐÂY --- */}
      {reply.replies && reply.replies.length > 0 && (
        reply.replies.map((childReply) => (
          <ReplyItem
            key={childReply.id}
            reply={childReply}
            parentId={reply.id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onVote={onVote}
            onToggleReply={onToggleReply}
            nextReply={nextReply}
          />
        ))
      )}
    </div>
  );
};

export default ReplyItem;