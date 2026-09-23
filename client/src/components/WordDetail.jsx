import { useState, useEffect } from "react";
import StrokeAnimation from "./StrokeAnimation";

export default function WordDetailModal({ word, isOpen, onClose }) {
  const [charIndex, setCharIndex] = useState(0);

  // Reset về chữ đầu mỗi khi mở modal với từ mới
  useEffect(() => {
    const fetchIndex = () => {
      if (isOpen) setCharIndex(0);
    };
    fetchIndex();
  }, [isOpen, word]);

  if (!word) return null;

  const characters = word.characters || [];
  const hasPrev = charIndex > 0;
  const hasNext = charIndex < characters.length - 1;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Chi Tiết Từ</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Thông tin từ */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold">{word.hanzi}</span>
            <span className="text-xl text-primary font-mono">
              {word.pinyin}
            </span>
            <span className="badge badge-primary badge-outline">
              {word.hskLevel}
            </span>
          </div>

          {/* Định nghĩa */}
          <div className="flex flex-col gap-1">
            {word.definitions.map((def, i) => (
              <div key={i}>
                <span className="badge badge-outline badge-info badge-sm mr-2">
                  {def.type}
                </span>
                <span>{def.meanings.join(", ")}</span>
              </div>
            ))}
          </div>

          {/* Metadata từ database */}
          <div className="stats stats-horizontal shadow-sm">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Trạng Thái</div>
              <div
                className={`stat-value text-base ${word.status === "Đã Ôn" ? "text-success" : "text-secondary"}`}
              >
                {word.status}
              </div>
            </div>
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Số Lần Ôn</div>
              <div className="stat-value text-base">
                {word.reviewCount || 0}
              </div>
            </div>
            {word.source && (
              <div className="stat py-2 px-4">
                <div className="stat-title text-xs">Nguồn</div>
                <div className="stat-value text-base">{word.source}</div>
              </div>
            )}
          </div>

          {word.lastReviewedAt && (
            <p className="text-xs text-base-content/50">
              Ôn Lần Cuối:{" "}
              {new Date(word.lastReviewedAt).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        {word.usagePatterns?.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="font-medium text-sm">Cấu Trúc Sử Dụng Từ</p>
            {word.usagePatterns.map((pattern, i) => (
              <div key={i} className="border border-base-300 rounded-lg p-3">
                <p className="font-mono text-primary text-sm mb-2">
                  {pattern.structure}
                </p>
                {pattern.explanation && (
                  <p className="text-sm text-base-content/70 mb-2">
                    {pattern.explanation}
                  </p>
                )}
                <div className="flex flex-col gap-1">
                  {pattern.examples.map((example, j) => (
                    <div
                      key={j}
                      className="text-sm border-l-2 border-base-300 pl-2"
                    >
                      <p>{example.hanzi}</p>
                      <p className="text-primary text-xs">{example.pinyin}</p>
                      <p className="text-base-content/60 text-xs">
                        {example.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stroke order */}
        {characters.length > 0 && (
          <div className="border-t border-base-300 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">Cách Viết Chữ Hán</p>
              <span className="text-sm text-base-content/50">
                {charIndex + 1} / {characters.length}
              </span>
            </div>

            {/* key = chữ hiện tại → đổi chữ thì component vẽ lại từ đầu */}
            <StrokeAnimation
              key={characters[charIndex]}
              char={characters[charIndex]}
            />

            {/* Điều hướng chữ */}
            {characters.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setCharIndex((i) => i - 1)}
                  disabled={!hasPrev}
                >
                  ← Trước
                </button>
                <div className="flex gap-1">
                  {characters.map((c, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${i === charIndex ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setCharIndex(i)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setCharIndex((i) => i + 1)}
                  disabled={!hasNext}
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
