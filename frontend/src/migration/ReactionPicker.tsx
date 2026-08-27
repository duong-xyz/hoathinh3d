
const ReactionPicker = ({ isReaction, popupPos, setIsReaction, activeCommentId,onSelectReaction }:any) => {

    return (
        <>
            {/* CHỈ RENDER KHI ĐÃ BẤM VÀ POPUPPOS KHÁC NULL */}
            {isReaction && popupPos && activeCommentId && (
                <div
                    id="fix_hover"
                    className="wv-reaction-picker"
                    role="menu"
                    aria-label="Chọn cảm xúc"
                    style={{
                        top: `${popupPos.top}px`,
                        left: `${popupPos.left}px`,
                    }}
                    onMouseEnter={() => setIsReaction(true)} // Giữ mở
                    onMouseLeave={() => setIsReaction(false)} // Tắt khi rời khỏi popup
                >
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="like"
                        data-label="Thích"
                        aria-label="Thích"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("like", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("like", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/like.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="love"
                        data-label="Yêu thích"
                        aria-label="Yêu thích"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("love", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("love", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/love.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="care"
                        data-label="Thương thương"
                        aria-label="Thương thương"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("lovelove", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("lovelove", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/lovelove.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="haha"
                        data-label="Haha"
                        aria-label="Haha"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("haha", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("haha", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/haha.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="wow"
                        data-label="Wow"
                        aria-label="Wow"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("wow", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("wow", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/wow.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="sad"
                        data-label="Buồn"
                        aria-label="Buồn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("sad", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("sad", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/sad.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                    <button
                        type="button"
                        className="wv-reaction-picker__item"
                        data-wv-reaction="angry"
                        data-label="Phẫn nộ"
                        aria-label="Phẫn nộ"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectReaction("wrath", activeCommentId);
                            setIsReaction(false)
                        }}
                        /* Touch trên Mobile */
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectReaction("wrath", activeCommentId);
                            setIsReaction(false)
                        }}
                    >
                        <img
                            src="/stickers/wrath.svg"
                            alt=""
                            width={40}
                            height={40}
                            decoding="async"
                        />
                    </button>
                </div>
            )}
        </>
    );
}

export default ReactionPicker;