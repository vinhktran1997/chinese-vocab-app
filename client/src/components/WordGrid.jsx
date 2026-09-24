import { useState } from "react";
import WordTile from "./WordTile";

export default function WordGrid({ words, onEdit, onDelete, onViewDetail }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (words.length === 0) {
    return (
      <div className="text-center py-10 text-base-content/50">
        Không tìm thấy từ nào. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {words.map((word) => (
        <WordTile
          key={word._id}
          word={word}
          isMenuOpen={openMenuId === word._id}
          onToggleMenu={setOpenMenuId}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}
