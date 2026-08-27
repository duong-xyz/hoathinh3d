import React from 'react';

export default function CommentItem({
    comment,
    setComments,
    setIsOpen,
    setOnSelectStickerCallback,
    handleAddComment,
    handleToggleReply,
    handleMouseEnter,
    handleMouseLeave,
    handleAddVotes1,
    RenderCommentContent,
    CommentForm,
    ReplyItem,
    handleFetchReplies,
    repliesMap,
}: any) {
    if (!comment) return null;

    const cmt = comment;
    const blogStyleClass = cmt.blogStyle ? `wpd-blog-${cmt.blogStyle}` : 'wpd-blog-user';
    return (
        <>
            <div
                id={`wpd-comm-${cmt.id}_0`}
                className={`comment byuser ${cmt.evenOddClass || 'even'} thread-${cmt.evenOddClass || 'even'} depth-1 wpd-comment ${cmt.levelClass || 'wpd_comment_level-1'} ${cmt.vipWrapClass || 'wrap-vip-3-month'}`}
            >
                <div className={`wpd-comment-wrap wpd-blog-user ${blogStyleClass}`}>

                    {/* ==================== CỘT BÊN TRÁI ==================== */}
                    <div className="wpd-comment-left ">

                        {/* 1. Avatar & Khung Vip */}
                        <div
                            className={`wpd-avatar wcai-short-info wcai-not-clicked ${cmt.avatarFrameClass || 'khung_vip_13'} avatar-padding`}
                        >
                            <img
                                src={cmt.avatar}
                                className="gravatar avatar avatar-64 um-avatar um-avatar-uploaded"
                                width="64"
                                height="64"
                                alt={cmt.author}
                                data-default="https://hoathinh3d.st/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg"
                                onError={(e) => {
                                    if (!e.currentTarget.getAttribute('data-load-error')) {
                                        e.currentTarget.setAttribute('data-load-error', '1');
                                        e.currentTarget.setAttribute(
                                            'src',
                                            e.currentTarget.getAttribute('data-default') || ''
                                        );
                                    }
                                }}
                                loading="lazy"
                            />
                        </div>

                        {/* 2. Pháp Tướng */}
                        {cmt.phapTuong && (
                            <>
                                <style
                                    dangerouslySetInnerHTML={{
                                        __html: `@media (max-width: 767px) {.${cmt.phapTuong.cmtClass || 'phap-tuong-46-cmt'} {margin: 0px 0px 0px 5px;transform: scale(1.2);}}@media (min-width: 768px) {.${cmt.phapTuong.cmtClass || 'phap-tuong-46-cmt'} {margin: -10px 0px 0px 5px;transform: scale(1.2);}}`,
                                    }}
                                />
                                <span
                                    className={`phap-tuong-image phap-tuong-animate ${cmt.phapTuong.rankClass || 'phap-tuong-rank-s'} ${cmt.phapTuong.cmtClass || 'phap-tuong-46-cmt'}`}
                                    data-name={cmt.phapTuong.name}
                                    style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        '--phap-tuong-img': `url(${cmt.phapTuong.src})`,
                                    } as React.CSSProperties}
                                >
                                    <img
                                        className="phap-tuong-img"
                                        src={cmt.phapTuong.src}
                                        alt={cmt.phapTuong.name}
                                        style={{ width: cmt.phapTuong.width || '70px' }}
                                    />
                                </span>
                            </>
                        )}

                        {/* 3. Cảnh Giới */}
                        {cmt.realm && (
                            <div
                                className="wpd-comment-label"
                                wpd-tooltip={cmt.realm}
                                wpd-tooltip-position="right"
                            >
                                <span>{cmt.realm}</span>
                            </div>
                        )}

                        {/* 4. Danh Hiệu Desktop */}
                        {cmt.appellation && (
                            <>
                                <style
                                    dangerouslySetInnerHTML={{
                                        __html: `@media (max-width: 767px) {.${cmt.appellation.cmtClass || 'danh-hieu-5-cmt'} {margin: 0 3px;transform: scale(1.6);}}@media (min-width: 768px) {.${cmt.appellation.cmtClass || 'danh-hieu-5-cmt'} {margin: -8px 5px;transform: scale(1.6);}}`,
                                    }}
                                />
                                <span
                                    className={`danh-hieu-image danh-hieu-animate ${cmt.appellation.cmtClass || 'danh-hieu-5-cmt'}`}
                                    style={{ pointerEvents: 'none', display: 'inline-block', verticalAlign: 'middle' }}
                                >
                                    <img
                                        className="danh-hieu-img"
                                        src={cmt.appellation.src}
                                        alt={cmt.appellation.name || ''}
                                        style={{ width: cmt.appellation.width || '100px' }}
                                    />
                                </span>
                            </>
                        )}

                        {/* 5. Nhẫn Chính */}
                        {cmt.ring && (
                            <div
                                className="wpd-ring-image"
                                id={`ring-user-${cmt.userId || cmt.id}`}
                                style={{ cursor: 'pointer', '--ring-cmt-w': cmt.ring.ringW || '50px' } as React.CSSProperties}
                                onClick={e => { const m = document.querySelector<HTMLElement>('.ring-modal'); m && (m.classList.add('active'), (m as HTMLElement).style.display = 'flex') }}
                            >
                                <img src={cmt.ring.src} alt={cmt.ring.name || ''} />
                            </div>
                        )}

                        {/* 6. Nhẫn Hồng Nhan */}
                        {cmt.hongNhan && (
                            <div
                                className="wpd-ring-image wpd-hn-ring-image"
                                id={`hn-ring-user-${cmt.userId || cmt.id}`}
                                style={{ cursor: 'pointer', '--ring-cmt-w': cmt.hongNhan.ringW || '50px' } as React.CSSProperties}
                                onClick={e => { const m = document.querySelector<HTMLElement>('.hn-modal'); m && (m.style.display = 'flex') }}
                            >
                                <img
                                    src={cmt.hongNhan.src}
                                    alt={cmt.hongNhan.name || ''}
                                    title={cmt.hongNhan.name || ''}
                                />
                            </div>
                        )}
                        {/* characters */}
                        {cmt.tinhLu && (
                            cmt.tinhLu.map((ny: any) => {
                                return (
                                    <>
                                        <style
                                            dangerouslySetInnerHTML={{
                                                __html: ` @media (min-width: 768px) {.character-94565 {margin: -40px 0 -7px -7px !important;display: inline-block;}}@media (max-width: 767px) {.character-94565 {margin: -40px 0 0px -15px !important;display: inline-block;}}`,
                                            }} />
                                        <div
                                            className="wpd-character-image character-94565"
                                            id="character-user-94565"
                                            data-tooltip={ny.name}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={ny.src}
                                                alt={ny.name}
                                                style={{ width: '80px' }}
                                            />
                                        </div>
                                    </>
                                );
                            })
                        )}

                    </div>

                    {/* ==================== CỘT BÊN PHẢI ==================== */}
                    <div id={`comment-${cmt.id}`} className="wpd-comment-right" style={{ '--vip-bg-url': cmt.vipBgUrl } as React.CSSProperties}>

                        {/* Header Bình Luận */}
                        <div className="wpd-comment-header" style={{ zIndex: 44 }}>

                            {/* CSS Responsive Danh Hiệu Mobile */}
                            <style
                                dangerouslySetInnerHTML={{
                                    __html: `@media (max-width: 767px) { .danh-hieu-image { display: none !important; } .danh-hieu-mobile { display: inline-block !important; } } @media (min-width: 768px) { .danh-hieu-image { display: inline-block; } .danh-hieu-mobile { display: none !important; } }`,
                                }}
                            />
                            {cmt.appellation && (
                                <>
                                    <style
                                        dangerouslySetInnerHTML={{
                                            __html: `@media (max-width: 767px) {.${cmt.appellation.mobileClass || 'danh-hieu-5-mobile'} {margin: 0 3px !important;transform: scale(1.6);vertical-align: middle;}}`,
                                        }}
                                    />
                                    <span
                                        className={`danh-hieu-mobile danh-hieu-animate ${cmt.appellation.mobileClass || 'danh-hieu-5-mobile'}`}
                                        style={{ display: 'none', pointerEvents: 'none' }}
                                    >
                                        <img
                                            className="danh-hieu-img"
                                            src={cmt.appellation.src}
                                            alt={cmt.appellation.name || ''}
                                            style={{ width: cmt.appellation.width || '100px' }}
                                        />
                                    </span>
                                </>
                            )}

                            {/* Tên Tác Giả & Các Huy Hiệu */}
                            <div className="wpd-comment-author wcai-uname-info wcai-not-clicked">

                                {/* Badge Tộc */}
                                {cmt.clanBadge && (
                                    <span
                                        className="custom-badge-tooltip"
                                        tabIndex={0}
                                        role="button"
                                        aria-label={cmt.clanName || 'Nhân Tộc'}
                                    >
                                        <img src={cmt.clanBadge} alt="" width="40px" />
                                        <span className="custom-badge-tooltiptext hh3d-badge-preview">
                                            <img
                                                src={cmt.clanBadge}
                                                alt=""
                                                style={{
                                                    maxWidth: '100%',
                                                    width: 'auto',
                                                    height: 'auto',
                                                    maxHeight: 'min(200px,42vh)',
                                                }}
                                            />
                                            <span className="custom-badge-name">{cmt.clanName || 'Nhân Tộc'}</span>
                                        </span>
                                    </span>
                                )}

                                {/* Tên Người Dùng */}
                                {` ${cmt.author}`}

                                {/* Tích Xanh Đã Xác Thực */}
                                {cmt.isVerified && (
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 24 24"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ color: '#0866ff', marginLeft: '5px' }}
                                    >
                                        <path fill="none" d="M0 0h24v24H0z" />
                                        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                                    </svg>
                                )}

                                {/* Custom Style cho Tông Môn */}
                                {cmt.sect && cmt.sect.customColorId && (
                                    <style
                                        dangerouslySetInnerHTML={{
                                            __html: `
                        @keyframes tmCustom${cmt.sect.customColorId} {
                          0%   { background-position: 0% center; }
                          50%  { background-position: 100% center; }
                          100% { background-position: 200% center; }
                        }
                        .bang-hoi-mau-custom.tm-gc-${cmt.sect.customColorId} { display: inline-block; font-family: 'UVN Hai Ba Trung'; font-size: 14px!important; font-weight: 700; filter: drop-shadow(0 0 1px #ff0000); background: linear-gradient(90deg, #ff0000, #00ff00, #0500fe, #00ff00, #ff0000); background-size: 650% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tmCustom${cmt.sect.customColorId} 3.5s ease-in-out infinite; }
                        .cp-preview-name.bang-hoi-mau-custom { display: inline-block; font-family: 'UVN Hai Ba Trung'; font-size: 14px!important; font-weight: 700; filter: drop-shadow(0 0 1px #ff0000); background: linear-gradient(90deg, #ff0000, #00ff00, #0500fe, #00ff00, #ff0000); background-size: 650% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tmCustom${cmt.sect.customColorId} 3.5s ease-in-out infinite; }
                        @media (prefers-reduced-motion: reduce) {
                          .bang-hoi-mau-custom.tm-gc-${cmt.sect.customColorId}, .cp-preview-name.bang-hoi-mau-custom { animation: none !important; background-position: 0 50% !important; filter: none !important; }
                        }
                      `,
                                        }}
                                    />
                                )}

                                {/* Huy Hiệu Cấp Tông Môn */}
                                {cmt.sect && cmt.sect.flagImg && (
                                    <span data-tooltip={cmt.sect.flagTooltip || 'Tông Cấp 7'}>
                                        <img
                                            src={cmt.sect.flagImg}
                                            alt={cmt.sect.flagTooltip || 'Tông Cấp 7'}
                                            style={{ width: '35px', height: 'auto', margin: '0px 0px 5px -5px' }}
                                        />
                                    </span>
                                )}

                                {/* Tên Tông Môn & Chức Vụ */}
                                {cmt.sect && cmt.sect.name && (
                                    <span
                                        className={`bang-hoi-mau-custom tm-gc-${cmt.sect.customColorId || '643208'}`}
                                    >
                                        <a
                                            href={cmt.sect.link || `/tong-mon/${cmt.sect.customColorId || '643208'}`}
                                            className="tong-link"
                                            style={{ color: 'inherit', textDecoration: 'none' }}
                                        >
                                            {cmt.sect.name}
                                        </a>{' '}
                                        <span data-tooltip={cmt.sect.role || 'Nngoại Môn'}></span>
                                    </span>
                                )}
                            </div>

                            {/* Danh sách Badges (Các Huy Hiệu Ghép Lớp) */}
                            {cmt.badges && cmt.badges.length > 0 && (
                                <div className="wpdiscuz-mycred-wrap">
                                    <div className="row mycred-users-badges wpdiscuz-mycred-badges-wrap">
                                        <div className="col-xs-12">
                                            {cmt.badges.map((badge: any) => (
                                                <div key={badge.id} className="the-badge">
                                                    <div
                                                        className="custom-badge-tooltip"
                                                        tabIndex={0}
                                                        role="button"
                                                        aria-label={badge.label}
                                                    >
                                                        {/* Icon Thu Nhỏ Ở Header */}
                                                        <span
                                                            className="hh3d-composed-badge"
                                                            style={{
                                                                display: 'inline-block',
                                                                position: 'relative',
                                                                verticalAlign: 'middle',
                                                                lineHeight: '0',
                                                                width: '70px',
                                                                height: '70px',
                                                            }}
                                                        >
                                                            <span
                                                                className="hh3d-composed-main"
                                                                style={{
                                                                    position: 'absolute',
                                                                    inset: '0',
                                                                    display: 'block',
                                                                    zIndex: '100',
                                                                }}
                                                            >
                                                                <img
                                                                    className="hh3d-composed-stack-img"
                                                                    src={badge.mainImg}
                                                                    alt=""
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        maxWidth: 'none',
                                                                        maxHeight: 'none',
                                                                        objectFit: 'contain',
                                                                        transform: 'rotate(0deg)',
                                                                    }}
                                                                />
                                                            </span>
                                                            {badge.layers &&
                                                                badge.layers.map((layer: any, lIdx: any) => (
                                                                    <span
                                                                        key={lIdx}
                                                                        className="hh3d-composed-layer"
                                                                        style={{
                                                                            position: 'absolute',
                                                                            width: `${layer.width || '24px'}`,
                                                                            height: `${layer.height || '24px'}`,
                                                                            left: layer.left || 'calc(50% + 0px - 12px)',
                                                                            top: layer.top || 'calc(50% + 0px - 12px)',
                                                                            transform: layer.transform || 'rotate(0deg)',
                                                                            zIndex: `${layer.zIndex || 110}`,
                                                                        }}
                                                                    >
                                                                        <img
                                                                            className="hh3d-composed-stack-img"
                                                                            src={layer.src}
                                                                            alt=""
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                maxWidth: 'none',
                                                                                maxHeight: 'none',
                                                                                objectFit: 'contain',
                                                                            }}
                                                                        />
                                                                    </span>
                                                                ))}
                                                        </span>

                                                        {/* Preview Phóng To Khi Hover */}
                                                        <span className="custom-badge-tooltiptext hh3d-badge-preview">
                                                            <span
                                                                className="hh3d-composed-badge"
                                                                style={{
                                                                    display: 'inline-block',
                                                                    position: 'relative',
                                                                    verticalAlign: 'middle',
                                                                    lineHeight: '0',
                                                                    width: '220px',
                                                                    height: badge.style?.height ? badge.style.height : '220px',
                                                                }}
                                                            >
                                                                <span
                                                                    className="hh3d-composed-main"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        inset: '0',
                                                                        display: 'block',
                                                                        zIndex: '100',
                                                                    }}
                                                                >
                                                                    <img
                                                                        className="hh3d-composed-stack-img"
                                                                        src={badge.mainImg}
                                                                        alt=""
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            maxWidth: 'none',
                                                                            maxHeight: 'none',
                                                                            objectFit: 'contain',
                                                                            transform: 'rotate(0deg)',
                                                                        }}
                                                                    />
                                                                </span>
                                                                {badge.layers &&
                                                                    badge.layers.map((layer: any, lIdx: any) => (
                                                                        <span
                                                                            key={lIdx}
                                                                            className="hh3d-composed-layer"
                                                                            style={{
                                                                                position: 'absolute',
                                                                                width: `${layer.previewWidth || '75px'}`,
                                                                                height: `${layer.previewHeight || '75px'}`,
                                                                                left: layer.previewLeft || 'calc(50% + 0px - 37px)',
                                                                                top: layer.previewTop || 'calc(50% + 0px - 37px)',
                                                                                transform: layer.transform || 'rotate(0deg)',
                                                                                zIndex: `${layer.zIndex || 110}`,
                                                                            }}
                                                                        >
                                                                            <img
                                                                                className="hh3d-composed-stack-img"
                                                                                src={layer.src}
                                                                                alt=""
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    maxWidth: 'none',
                                                                                    maxHeight: 'none',
                                                                                    objectFit: 'contain',
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    ))}
                                                            </span>
                                                            <div className="custom-badge-name">{badge.label}</div>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thời Gian Đăng Bình Luận */}
                            <div className="wpd-comment-date" title={cmt.fullDate || ''}>
                                <i className="far fa-clock" aria-hidden="true"></i> {cmt.date}
                            </div>

                            <div className="wpd-space"></div>

                            {/* Tùy Chọn Ẩn (Info / Link) */}
                            <div className="wpd-comment-link wpd-hidden">
                                <span wpd-tooltip="Comment author information" wpd-tooltip-size="medium">
                                    <i id={`wcai-comment_${cmt.id}`} className="fas fa-info wpf-cta wcai-info wcai-not-clicked"></i>
                                </span>
                                <span wpd-tooltip="Liên kết bình luận" wpd-tooltip-position="left">
                                    <i
                                        className="fas fa-link"
                                        aria-hidden="true"
                                        data-wpd-clipboard={`https://hoathinh3d.st/quang-am-chi-ngoai#comment-${cmt.id}`}
                                    ></i>
                                </span>
                            </div>
                        </div>

                        {/* Nội Dung Bình Luận */}
                        {RenderCommentContent ? (
                            <RenderCommentContent content={cmt.text} />
                        ) : (
                            <div className="wpd-comment-text">
                                <p>{cmt.text}</p>
                            </div>
                        )}

                        {/* Chân Bình Luận (Like, Dislike, Phản Hồi) */}
                        {/* Chân Bình Luận (Like, Dislike, Phản Hồi) */}
                        <div className="wpd-comment-footer">
                            <div className="wpd-vote">
                                {/* Nút Like / Vote Up */}
                                <div
                                    className={`wpd-vote-up wpd_not_clicked ${cmt.reactionType ? "wv-has-user-reaction" : ""}`}
                                    onClick={(e) => handleMouseEnter && handleMouseEnter(e, cmt.id)}
                                    onMouseEnter={(e) => handleMouseEnter && handleMouseEnter(e, cmt.id)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                                    </svg>
                                    {cmt.reactionType && (<img
                                        className="wv-vote-up__reaction"
                                        src={`/stickers/${cmt.reactionType}.svg`}
                                        alt="Thích"
                                        width={20}
                                        height={20}
                                        decoding="async"
                                    />)}
                                </div>
                                {cmt.reactionType && (<span
                                    className="wv-reaction-summary wv-likers-hit"
                                    role="button"
                                    tabIndex={0}
                                    title="Xem danh sách cảm xúc"
                                    aria-label="Xem 1 lượt bình chọn"
                                >
                                    <span className="wv-reaction-summary__icons" aria-hidden="true">
                                        <img
                                            className="wv-reaction-summary__icon"
                                            src={`/stickers/${cmt.reactionType}.svg`}
                                            alt="Thích"
                                            width={18}
                                            height={18}
                                            loading="lazy"
                                        />
                                    </span>
                                    <span className="wv-reaction-summary__count">{cmt.votes}</span>
                                </span>)}

                                {/* Số lượng Vote */}
                                <div className="wpd-vote-result wv-like-hidden">{cmt.votes || 0}</div>

                                {/* Nút Dislike / Vote Down */}
                                <div
                                    className="wpd-vote-down wpd_not_clicked wpd-dislike-hidden"
                                    onClick={() => handleAddVotes1 && handleAddVotes1('down', cmt.id, setComments)}
                                    onMouseEnter={(e) => handleMouseEnter && handleMouseEnter(e, cmt.id)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                                    </svg>
                                </div>
                            </div>

                            <div
                                className="wpd-reply-button"
                                onClick={() => handleToggleReply && handleToggleReply(cmt.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path>
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                </svg>
                                <span>Phản hồi</span>
                            </div>
                            <div className="wpd-space"></div>
                            {cmt.replyCount > 0 && (
                                <div
                                    className="wpd-toggle wpd-hidden wpd_not_clicked"
                                    wpd-tooltip="Xem phản hồi"
                                    wpd-tooltip-position="left"
                                    onClick={() => handleFetchReplies(cmt.id)}
                                >
                                    <span className="wpd-view-replies">
                                        <span className="wpd-view-replies-text">Xem ({cmt.replyCount}) phản hồi</span>
                                    </span>
                                    <i className="fas fa-chevron-down" />
                                </div>
                            )}

                        </div>

                    </div>
                </div>

                {/* Form Phản Hồi */}
                {cmt.isReply && CommentForm && (
                    <CommentForm
                        setIsOpen={setIsOpen}
                        setOnSelectStickerCallback={setOnSelectStickerCallback}
                        onAddComment={handleAddComment}
                    />
                )}

                {/* Các Bình Luận Con (Replies) */}
                {repliesMap[cmt.id] && ReplyItem && (
                    <div className="wpd-reply-responses">
                        {repliesMap[cmt.id].map((reply: any) => (
                            <ReplyItem
                                key={reply.id}
                                reply={reply}
                                parentId={cmt.id}
                                onMouseEnter={(e: any, id: any) => handleMouseEnter && handleMouseEnter(e, id)}
                                onMouseLeave={handleMouseLeave}
                                onVote={(type: any, id: any) =>
                                    handleAddVotes1 && handleAddVotes1(type, id, setComments)
                                }
                                onToggleReply={(id: any) => handleToggleReply && handleToggleReply(id)}
                                nextReply={{
                                    setIsOpen: setIsOpen,
                                    setOnSelectStickerCallback: setOnSelectStickerCallback,
                                    onAddComment: handleAddComment,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Anchor Element Đúng Chuẩn HTML WordPress Discuz */}
            <div id={`wpdiscuz_form_anchor-${cmt.id}_0`}></div>
        </>
    );
}