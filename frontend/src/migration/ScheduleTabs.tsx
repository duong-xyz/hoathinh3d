import React, { useState, useEffect, useRef } from "react";

// Thêm Props interface
interface ScheduleTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ScheduleTabs({ activeTab, onTabChange }: ScheduleTabsProps) {
  // Mapping ID tab với cấu hình Bitmask
  const daysOfWeek = [
    { id: "MON", label: "Thứ Hai" },
    { id: "TUE", label: "Thứ Ba" },
    { id: "WED", label: "Thứ Tư" },
    { id: "THU", label: "Thứ Năm" },
    { id: "FRI", label: "Thứ Sáu" },
    { id: "SAT", label: "Thứ Bảy" },
    { id: "SUN", label: "Chủ Nhật" },
  ];

  const [todayId, setTodayId] = useState<string>("TUE");
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // 0: SUN, 1: MON, 2: TUE, ...
    const daysMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const currentDayIndex = new Date().getDay();
    setTodayId(daysMap[currentDayIndex]);
  }, []);

  const handleTabClick = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    onTabChange(tabId); // Báo về cho Home Component
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 150;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* DESKTOP NAV */}
      <ul
        className="nav nav-pills nav-justified halim-schedule-block schedule"
        data-today={todayId}
      >
        <li role="presentation" className={activeTab === "latest" ? "active" : ""}>
          <a
            href="#latest"
            className="hh3d-latest-tab"
            onClick={(e) => handleTabClick(e, "latest")}
          >
            <span className="h-text">Mới Cập Nhật</span>
          </a>
        </li>

        {daysOfWeek.map((day) => {
          let liClass = "";
          if (activeTab === day.id) liClass += " active";
          if (todayId === day.id) liClass += " today";

          return (
            <li key={day.id} role="presentation" data-id={day.id} className={liClass.trim()}>
              <a href={`#${day.id}`} onClick={(e) => handleTabClick(e, day.id)}>
                {day.label}
              </a>
            </li>
          );
        })}
      </ul>

      {/* MOBILE NAV */}
      <ul className="nav nav-pills nav-justified halim-schedule-block-mobile mt-3">
        <li
          role="presentation"
          id="moviesLatest"
          className={activeTab === "latest" ? "active" : ""}
        >
          <a
            href="#latest"
            className="hh3d-latest-tab"
            onClick={(e) => handleTabClick(e, "latest")}
          >
            <span className="h-text">
              <i className="fas fa-fire" /> Mới Cập Nhật
            </span>
          </a>
        </li>
        <li role="presentation" id="scheduleFullLink">
          <a href="/lich-chieu">
            <i className="fas fa-calendar-alt" /> Lịch Chiếu
          </a>
        </li>
      </ul>

      <div className="hh3d-sched-strip">
        <button
          type="button"
          className="hh3d-sched-arrow left"
          aria-label="Xem ngày trước"
          onClick={() => handleScroll("left")}
        >
          <i className="fas fa-chevron-left" aria-hidden="true" />
        </button>

        <ul 
          ref={scrollContainerRef}
          className="nav nav-pills nav-justified halim-schedule-block-mobile menu schedule"
        >
          {daysOfWeek.map((day) => {
            let liClass = "";
            if (activeTab === day.id) liClass += " active";
            if (todayId === day.id) liClass += " today";

            return (
              <li key={`mobile-${day.id}`} role="presentation" data-id={day.id} className={liClass.trim()}>
                <a href={`#${day.id}`} onClick={(e) => handleTabClick(e, day.id)}>
                  {day.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="hh3d-sched-arrow right"
          aria-label="Xem ngày sau"
          onClick={() => handleScroll("right")}
        >
          <i className="fas fa-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}