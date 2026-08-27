import React, { useState } from "react";

// 1. Định nghĩa kiểu dữ liệu cho Sticker
export interface StickerItem {
  id: number | string;
  url: string;
}

// 2. Định nghĩa kiểu dữ liệu cho Bộ Sticker (Sticker Pack)
export interface StickerPack {
  id: string | number;
  name: string;
  isRecent?: boolean;
  icon?: string;
  stickers?: StickerItem[];
}

// 3. Định nghĩa Props cho Component Sticker
export interface StickerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelectSticker?: (sticker: StickerItem) => void;
}

// Dữ liệu mẫu
export const MOCK_PACKS: StickerPack[] = [
  {
    id: "recent",
    name: "Đã dùng gần đây",
    isRecent: true,
  },
  {
    id: 29,
    name: "Thỏ Hài Nhạt",
    icon: "/stickers/tho-hai-nhat-1.webp",
    stickers: [
      { id: 1056, url: "/stickers/tho-hai-nhat-1.webp" },
      { id: 1057, url: "/stickers/tho-hai-nhat-2.webp" },
    ],
  },
  {
    id: 28,
    name: "Chuyện Chung Cư Cũ",
    icon: "/stickers/chuyen-chung-cu-cu-10.webp",
    stickers: [
      { id: 1042, url: "/stickers/chuyen-chung-cu-cu-3.webp" },
    ],
  },
  {
    id: 1,
    name: "Quynh Aka - Stay At Home",
    icon: "/stickers/quynh-aka-stay-at-home-4.webp",
    stickers: [
      { id: 1001, url: "/stickers/quynh-aka-stay-at-home-4.webp" },
    ],
  },
  {
    id: 4,
    name: "Pepe",
    icon: "/stickers/pepe-21.webp",
    stickers: [
      { id: 1002, url: "/stickers/pepe-21.webp" },
    ],
  },
];

const Sticker: React.FC<StickerProps> = ({
  isOpen,
  setIsOpen,
  onSelectSticker,
}) => {
  // 1. Quản lý tab đang chọn (Mặc định chọn 'recent')
  const [activeTab, setActiveTab] = useState<string | number>("recent");

  // 2. Trạng thái loading giả lập khi đổi tab
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 3. Danh sách Sticker đã dùng gần đây (Khởi tạo từ localStorage)
  const [recentStickers, setRecentStickers] = useState<StickerItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("wpd_recent_stickers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Khi bấm chuyển Tab
  const handleTabChange = (packId: string | number) => {
    if (packId === activeTab) return;
    setIsLoading(true);
    setActiveTab(packId);

    // Giả lập delay mạng nhẹ khi tải sticker
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  // Khi chọn một Sticker
  const handleSelectSticker = (sticker: StickerItem) => {
    // A. Thêm vào danh sách vừa dùng (tránh trùng lặp & giới hạn tối đa 15 cái)
    const filteredRecent = recentStickers.filter(
      (item) => item.id !== sticker.id
    );
    const updatedRecent = [sticker, ...filteredRecent].slice(0, 15);

    setRecentStickers(updatedRecent);
    localStorage.setItem(
      "wpd_recent_stickers",
      JSON.stringify(updatedRecent)
    );

    // B. Trả dữ liệu ra ngoài cho callback xử lý
    if (onSelectSticker) {
      onSelectSticker(sticker);
    }

    // C. Đóng Popup
    setIsOpen(false);
  };

  // Tìm thông tin Pack hiện tại đang được chọn
  const currentPack = MOCK_PACKS.find((pack) => pack.id === activeTab);

  // Lấy danh sách Sticker cần hiển thị
  const displayStickers: StickerItem[] =
    activeTab === "recent"
      ? recentStickers
      : currentPack?.stickers || [];

  if (!isOpen) return null;

  return (
    <>
      {/* Click vào nền đen để đóng */}
      <div
        id="wpdiscuz-sticker-popup-bg"
        style={{ display: "block" }}
        onClick={() => setIsOpen(false)}
      />

      <div
        id="wpdiscuz-sticker-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Chọn Sticker"
        className="wpds-open"
        style={{ display: "flex" }}
      >
        {/* HEADER */}
        <div id="wpdiscuz-sticker-header">
          <div className="wpds-header-row">
            <span className="wpds-title">🎭 Sticker</span>
            <button
              onClick={() => setIsOpen(false)}
              id="wpdiscuz-sticker-close"
              aria-label="Đóng"
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          </div>
        </div>

        {/* LIST TABS */}
        <div id="wpdiscuz-sticker-tabs">
          {MOCK_PACKS.map((pack) => (
            <button
              key={pack.id}
              type="button"
              className={`wpdiscuz-sticker-tab ${
                activeTab === pack.id ? "active" : ""
              }`}
              title={pack.name}
              onClick={() => handleTabChange(pack.id)}
            >
              {pack.isRecent ? (
                <svg
                  className="wpds-recent-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={12} cy={12} r={10} />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ) : (
                <img
                  className="wpdiscuz-sticker-tab-icon"
                  src={pack.icon}
                  alt={pack.name}
                />
              )}
            </button>
          ))}
        </div>

        {/* TÊN BỘ STICKER HIỆN TẠI */}
        <div id="wpdiscuz-sticker-pack-label" style={{ display: "block" }}>
          {currentPack ? currentPack.name : "Stickers"}
        </div>

        {/* NỘI DUNG / MÀN HÌNH CHỜ */}
        {isLoading ? (
          /* SKELETON LOADING */
          <div id="wpdiscuz-sticker-loading" style={{ display: "block" }}>
            <div className="wpds-skel-grid">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div key={idx} className="wpds-skel" />
              ))}
            </div>
          </div>
        ) : (
          /* DANH SÁCH STICKER */
          <div id="wpdiscuz-sticker-content">
            {displayStickers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                Chưa có sticker nào ở đây.
              </div>
            ) : (
              <div className="wpdiscuz-sticker-grid">
                {displayStickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="wpdiscuz-sticker-item"
                    onClick={() => handleSelectSticker(sticker)}
                  >
                    <img src={sticker.url} alt="Sticker" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sticker;