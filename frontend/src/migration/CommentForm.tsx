import React, { useState, type SyntheticEvent, type FormEvent, type ChangeEvent } from 'react';

// Định nghĩa kiểu dữ liệu cho Sticker
export interface Sticker {
  id: string | number;
  url: string;
}

// Định nghĩa kiểu dữ liệu cho Flag
export interface FlagItem {
  name: string;
  src: string;
  width: number;
}

// Định nghĩa kiểu dữ liệu cho Sword
export interface SwordItem {
  name: string;
  src: string;
  flip: boolean;
}

// Định nghĩa cấu trúc bình luận mới gửi lên
export interface CommentPayload {
  id: string;
  author: string;
  username: string;
  avatar: string;
  realm: string;
  clanBadge: string;
  clanName: string;
  flags: FlagItem[];
  sect: string;
  sectRole: string;
  swords: SwordItem[];
  date: string;
  fullDate: string;
  text: string;
  votes: number;
  blogStyle: string;
  nameColorClass: string;
  sectColorClass: string;
  avatarFrameClass: string;
  isReply: boolean;

}

// Interface cho Props của CommentForm
// export interface CommentFormProps {
//   setIsOpen?: (isOpen: boolean) => void;
//   setOnSelectStickerCallback?: (callback: (sticker: Sticker) => void) => void;
//   onAddComment?: (comment: CommentPayload) => void;
// }

const CommentForm: React.FC<any> = ({
  setIsOpen,
  setOnSelectStickerCallback,
  onAddComment,
  handleCreateRootComment,
}) => {
  // Quản lý trạng thái nội dung textarea và số ký tự còn lại
  const [commentText, setCommentText] = useState<string>("");
  const maxLength = 1000;

  // Xử lý khi ảnh avatar bị lỗi tải (Tự động đổi sang ảnh mặc định)
  const handleAvatarError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const defaultAvatar = "/stickers/avatar_1.jpeg";
    if (!target.getAttribute('data-load-error')) {
      target.setAttribute('data-load-error', '1');
      target.src = defaultAvatar;
    }
  };

  const handleCanSelectSticker = () => {
    setOnSelectStickerCallback((sticker: Sticker) => {
      if (sticker?.url) {
        setCommentText((prev) => `${prev} [sticker id="${sticker.id}"]`);
      }
    });
    // Mở popup sticker
    setIsOpen?.(true);
  };

  // Logic tạo và gửi bình luận mới

  return (
    <div
      className="wpd-form wpd-form-wrapper wpd-secondary-form-wrapper"
      id="wpd-secondary-form-wrapper-1939281_0"
    >
      <div className="wpd-secondary-forms-social-content" />
      <div className="clearfix" />

      <form
        method="post"
        encType="multipart/form-data"
        data-uploading="false"
        className="wpd_comm_form wpd-secondary-form-wrapper"
        onSubmit={e => handleCreateRootComment(e, commentText)}
      >
        <div className="wpd-field-comment">
          <div className="wpdiscuz-item wc-field-textarea">
            <div className="wpdiscuz-textarea-wrap wpd-txt">

              {/* Vùng Avatar */}
              <div className="wpd-avatar">
                <img
                  src="https://hoathinh3d.st/wp-content/uploads/ultimatemember/189458/profile_photo.png?t=1782829829"
                  className="gravatar avatar avatar-56 um-avatar um-avatar-uploaded"
                  width={56}
                  height={56}
                  alt="Dương Hoàng1"
                  onError={handleAvatarError}
                  loading="lazy"
                />
              </div>

              {/* Vùng Nhập văn bản */}
              <div className="wpd-textarea-wrap">
                <div
                  id="wpd-editor-char-counter-1939281_0"
                  className="wpd-editor-char-counter"
                >
                  {maxLength - commentText.length}
                </div>

                <label style={{ display: "none" }} htmlFor="wc-textarea-1939281_0">
                  Label
                </label>

                <textarea
                  id="wc-textarea-1939281_0"
                  maxLength={maxLength}
                  placeholder="Tham gia bình loạn"
                  aria-label="Tham gia bình loạn"
                  name="wc_comment"
                  className="wc_comment wpd-field"
                  style={{ overflow: "hidden", minHeight: "2em", height: "55.2px" }}
                  value={commentText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                />

                <div
                  className="autogrow-textarea-mirror"
                  style={{
                    display: "none",
                    overflowWrap: "break-word",
                    padding: "10px 15px",
                    width: 652,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 14,
                    lineHeight: "normal"
                  }}
                >
                  .<br />.
                </div>
              </div>

              {/* Icon Sticker */}
              <div className="wpd-editor-buttons-right">
                <style>{`#wpdcom .wpdiscuz-sticker-icon { width: 113px !important;white-space: nowrap;font-size: small;font-style: italic;}`}</style>

                <span
                  onClick={handleCanSelectSticker}
                  className="wpdiscuz-sticker-icon"
                  title="Stickers"
                >
                  Chọn stickers&nbsp;
                  <svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.5,2C3.56,2 2,3.56 2,5.5V18.5C2,20.44 3.56,22 5.5,22H16L22,16V5.5C22,3.56 20.44,2 18.5,2H5.5M5.75,4H18.25A1.75,1.75 0 0,1 20,5.75V15H18.5C16.56,15 15,16.56 15,18.5V20H5.75A1.75,1.75 0 0,1 4,18.25V5.75A1.75,1.75 0 0,1 5.75,4M14.44,6.77C14.28,6.77 14.12,6.79 13.97,6.83C13.03,7.09 12.5,8.05 12.74,9C12.79,9.15 12.86,9.3 12.95,9.44L16.18,8.56C16.18,8.39 16.16,8.22 16.12,8.05C15.91,7.3 15.22,6.77 14.44,6.77M8.17,8.5C8,8.5 7.85,8.5 7.7,8.55C6.77,8.81 6.22,9.77 6.47,10.7C6.5,10.86 6.59,11 6.68,11.16L9.91,10.28C9.91,10.11 9.89,9.94 9.85,9.78C9.64,9 8.95,8.5 8.17,8.5M16.72,11.26L7.59,13.77C8.91,15.3 11,15.94 12.95,15.41C14.9,14.87 16.36,13.25 16.72,11.26Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phần chân Form & Nút gửi */}
        <div className="wpd-form-foot">
          <div className="wpdiscuz-textarea-foot">
            <div className="wpdiscuz-button-actions" />
          </div>
          <div className="wpd-form-row">
            <div className="wpd-form-col-full">
              <div className="wc-field-submit">
                <input
                  id="wpd-field-submit-1939281_0"
                  className="wc_comm_submit wpd_not_clicked wpd-prim-button"
                  type="submit"
                  name="submit"
                  value="Gửi"
                  aria-label="Gửi"
                />
              </div>

              <b style={{ display: 'block', marginTop: '10px' }}>
                <span color="red">
                  Hãy cẩn thận ngôn từ, mọi hành vi xúc phạm, văng tục sẽ bị cấm tài khoản
                </span>
              </b>
              <b>
                <span color="red">
                  Mọi bình luận spam tuyển mem ở trang xem phim sẽ bị xoá
                </span>
              </b>
            </div>
            <div className="clearfix" />
          </div>
        </div>

        <input
          type="hidden"
          className="wpdiscuz_unique_id"
          value="1939281_0"
          name="wpdiscuz_unique_id"
        />
      </form>
    </div>
  );
};

export default CommentForm;