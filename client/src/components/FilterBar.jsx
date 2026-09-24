import {
  HSK_LEVELS,
  WORD_TYPES,
  SOURCES,
  STATUSES,
  LIMITS,
} from "../utils/wordFormUtils";

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-base-content/50">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        <button
          className={`btn btn-xs ${value === "" ? "btn-primary" : "btn-ghost border border-base-300"}`}
          onClick={() => onChange("")}
        >
          Tất Cả
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            className={`btn btn-xs ${value === opt ? "btn-primary" : "btn-ghost border border-base-300"}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({ filters, onFilter, onLimitChange }) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* HSK Level */}
      <ChipGroup
        label="Trình Độ"
        options={HSK_LEVELS}
        value={filters.hskLevel}
        onChange={(v) => onFilter("hskLevel", v)}
      />
      {/* Word Type */}
      <ChipGroup
        label="Từ Loại"
        options={WORD_TYPES}
        value={filters.type}
        onChange={(v) => onFilter("type", v)}
      />
      {/* Status */}
      <ChipGroup
        label="Trạng Thái"
        options={STATUSES}
        value={filters.status}
        onChange={(v) => onFilter("status", v)}
      />
      {/* Source */}
      <ChipGroup
        label="Nguồn"
        options={SOURCES}
        value={filters.source}
        onChange={(v) => onFilter("source", v)}
      />
      {/* Limit */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-base-content/50">
          Hiển thị
        </span>
        <select
          className="select select-bordered select-xs"
          value={filters.limit}
          onChange={(e) => onLimitChange(e.target.value)}
        >
          {LIMITS.map((limit) => (
            <option key={limit} value={limit}>
              {limit} từ/trang
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
