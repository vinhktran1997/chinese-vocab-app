import { useRef, useEffect } from "react";
import { getToneColor } from "../utils/toneColor";

const STATUS_STRIP_COLOR = {
  "Đã Ôn": "bg-[#639922]",
  "Chưa Ôn": "bg-[#EF9F27]",
};

export default function WordTile({
  word,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onViewDetail,
}) {
  const menuRef = useRef(null);

  // Đóng menu khi click ra ngoài thẻ
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onToggleMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, onToggleMenu]);

  return (
    <div
      className="group relative rounded-lg overflow-hidden cursor-pointer bg-[#F6F1E4] shadow-[inset_0_1px_0_rgba(255,255,255,0.6), inset_0_-2px_3px_rgba(0,0,0,0, 0.06), 0_2px_4px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6), inset_0_-2px_3px_rgba(0,0,0,0.06), 0_5px_12px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 transition-all"
      onClick={() => onViewDetail(word)}
    >
      {/* Trình Độ HSK */}
      <span className="absolute top-2 left-2 flex items-center justify-center rounded-lg px-2 bg-[#2B2B28] text-[#F6F1E4] text-[10px] font-medium">
        {word.hskLevel}
      </span>

      {/* Hamburger Menu */}
      <div ref={menuRef} className="absolute top-1 right-1">
        <button
          className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(isMenuOpen ? null : word._id);
          }}
          aria-label="Tùy chọn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#2B2B28"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <ul className="absolute right-0 mt-1 menu bg-base-100 rounded-box shadow-lg w-28 p-1 z-10 border border-base-300">
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu(null);
                  onEdit(word);
                }}
              >
                Chỉnh Sửa
              </button>
            </li>
            <li>
              <button
                className="text-error"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu(null);
                  onDelete(word._id);
                }}
              >
                Xoá
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Nội Dung Thẻ */}
      <div className="pt-7 pb-2 px-2 text-center">
        <p
          className="text-4xl font-medium leading-tight text-[#2B2B28]"
          style={{
            textShadow:
              "0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(0,0,0,0.1)",
          }}
        >
          {word.hanzi}
        </p>
        <p
          className="text-sm font-mono mt-1"
          style={{ color: getToneColor(word.pinyin) }}
        >
          {word.pinyin}
        </p>
      </div>

      {/* Màu chân đế của miếng gỗ */}
      <div
        className={`h-1.5 ${STATUS_STRIP_COLOR[word.status] || "bg-[#B4B2A9]"}`}
      />
    </div>
  );
}
