import React from 'react';

// ==========================================
// 1. ĐỊNH NGHĨA KHO KIỂU DỮ LIỆU (TYPES & INTERFACES)
// ==========================================
export interface DropdownItem {
  label: string;
  value: string;
}

export interface Episode {
  id: number;
  title: string;
  thumb: string;
}

export interface EpisodeSidebarProps {
  titleMovie?: string;
}

// ==========================================
// 2. MOCK DATA ĐÃ ĐƯỢC ĐỊNH KIỂU
// ==========================================
const SEASONS_MOCK: DropdownItem[] = [
  { label: 'Phần Chính', value: 'main' },
  { label: 'Phần 2', value: 'ss2' },
];

const SUB_MOCK: DropdownItem[] = [
  { label: 'Việt Sub', value: 'vi' },
  { label: 'Thuyết Minh', value: 'tm' },
];

const EPISODES_MOCK: Episode[] = Array.from({ length: 15 }, (_, i) => ({
  id: 149 - i,
  title: `Tập ${149 - i}`,
  thumb: 'https://unsplash.com',
}));

// ==========================================
// 3. MAIN COMPONENT (EPISODE SIDEBAR)
// ==========================================
export default function EpisodeSidebar({
  titleMovie = 'Tiên Nghịch',
}: EpisodeSidebarProps): React.ReactElement {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-sans text-white select-none">
      {/* KHUNG TRÌNH PHÁT VIDEO GIẢ LẬP ĐỂ TEST BỐ CỤC */}
      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
        <span className="text-zinc-500 text-sm">
          Trình phát video chính (Video Container)
        </span>
      </div>

      {/* NÚT MỞ Ở TRÊN THANH HEADER (BẠN ĐẶT NÚT NÀY VÀO TRONG HEADER CỦA BẠN) */}
      <div className="absolute top-4 left-4 z-30">
        <label
          htmlFor="sidebar-toggle-native"
          className="flex items-center gap-1.5 bg-black/60 hover:bg-black/90 px-3 py-1.5 rounded-md text-xs font-medium border border-white/10 cursor-pointer shadow-md select-none transition-all hover:border-orange-500/50"
        >
          ☰ Danh sách tập
        </label>
      </div>

      {/* 1. INPUT CHECKBOX ẨN ĐỂ QUẢN LÝ TRẠNG THÁI TRƯỢT ĐÓNG / MỞ */}
      <input
        type="checkbox"
        id="sidebar-toggle-native"
        className="peer/sidebar hidden"
      />

      {/* 2. LỚP OVERLAY MỜ NỀN KHI MỞ SIDEBAR */}
      <label
        htmlFor="sidebar-toggle-native"
        className="absolute inset-0 bg-black/60 z-40 opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out peer-checked/sidebar:opacity-100 peer-checked/sidebar:pointer-events-auto cursor-pointer"
      />

      {/* 3. KHỐI SIDEBAR FULL CHIỀU CAO CONTAINER VỚI HIỆU ỨNG TRƯỢT (SLIDE IN) */}
      <div className="absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#0c0c0e]/95 border-l border-white/5 z-50 flex flex-col translate-x-full peer-checked/sidebar:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl">
        {/* TIÊU ĐỀ SIDEBAR + NÚT X ĐÓNG */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <h3 className="font-bold text-base tracking-wide">{titleMovie}</h3>
          <label
            htmlFor="sidebar-toggle-native"
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer text-sm"
          >
            ✕
          </label>
        </div>

        {/* CỤM 2 NÚT DROPDOWN LỌC DÙNG :focus-within THUẦN CSS */}
        <div className="flex gap-2 px-4 pb-4 border-b border-white/5">
          {/* Dropdown Chọn Phần */}
          <div className="relative flex-1 group/dropdown" tabIndex={0}>
            <button
              type="button"
              className="w-full flex items-center justify-between bg-[#1c1c22] hover:bg-[#25252d] px-2.5 py-1.5 rounded text-xs font-medium border border-white/5 text-[#d1d5db] cursor-pointer"
            >
              <span>☰ Phần Chính</span>
              <span className="text-[9px] opacity-50 transition-transform duration-200 group-focus-within/dropdown:rotate-180">
                ▼
              </span>
            </button>
            <div className="absolute top-[calc(100%+4px)] left-0 flex flex-col bg-[#141419] border border-white/10 rounded p-1 min-w-[130px] shadow-2xl z-50 invisible opacity-0 scale-95 origin-top transition-all duration-150 group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100 group-focus-within/dropdown:scale-100">
              {SEASONS_MOCK.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`w-full text-left text-xs px-3 py-2 rounded-sm cursor-pointer hover:bg-white/10 outline-none ${
                    item.value === 'main'
                      ? 'text-orange-500 font-semibold'
                      : 'text-white/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Chọn Loại Sub */}
          <div className="relative flex-1 group/dropdown" tabIndex={0}>
            <button
              type="button"
              className="w-full flex items-center justify-between bg-[#1c1c22] hover:bg-[#25252d] px-2.5 py-1.5 rounded text-xs font-medium border border-white/5 text-[#d1d5db] cursor-pointer"
            >
              <span>☰ Việt Sub</span>
              <span className="text-[9px] opacity-50 transition-transform duration-200 group-focus-within/dropdown:rotate-180">
                ▼
              </span>
            </button>
            <div className="absolute top-[calc(100%+4px)] right-0 flex flex-col bg-[#141419] border border-white/10 rounded p-1 min-w-[110px] shadow-2xl z-50 invisible opacity-0 scale-95 origin-top transition-all duration-150 group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100 group-focus-within/dropdown:scale-100">
              {SUB_MOCK.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`w-full text-left text-xs px-3 py-2 rounded-sm cursor-pointer hover:bg-white/10 outline-none ${
                    item.value === 'vi'
                      ? 'text-orange-500 font-semibold'
                      : 'text-white/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DANH SÁCH TẬP PHIM CUỘN DỌC */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {EPISODES_MOCK.map((ep) => {
            const isActiveEpisode = ep.id === 149; // Tập 149 đang xem
            return (
              <div
                key={ep.id}
                className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer transition-all border ${
                  isActiveEpisode
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-500 font-bold shadow-[inset_0_0_12px_rgba(234,88,12,0.05)]'
                    : 'bg-transparent border-transparent hover:bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                {/* Khối khung chứa ảnh thu nhỏ (Thumbnail) */}
                <div className="relative w-20 h-11 bg-zinc-800 rounded overflow-hidden flex-shrink-0 border border-white/5">
                  <img
                    src={ep.thumb}
                    alt={ep.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  {/* Nút Play tam giác nhỏ nằm đè lên ảnh khi tập đang chạy */}
                  {isActiveEpisode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="text-orange-500 text-[10px]">▶</span>
                    </div>
                  )}
                </div>
                {/* Tiêu đề tập phim */}
                <span className="text-xs md:text-sm tracking-wide">
                  {ep.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}