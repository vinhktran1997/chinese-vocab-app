const HSK_LEVELS = [
  'HSK1',
  'HSK2',
  'HSK3',
  'HSK4',
  'HSK5',
  'HSK6',
  'HSK7-9',
  'Khác',
];

const WORD_TYPES = [
  'Danh Từ',
  'Động Từ',
  'Động Từ Li Hợp',
  'Tính Từ',
  'Phó Từ',
  'Đại Từ',
  'Lượng Từ',
  'Số Từ',
  'Trợ Từ',
  'Giới Từ',
  'Liên Từ',
  'Cụm Từ',
  'Động Từ/Danh Từ',
  'Danh Từ (Phương vị từ)',
  'Khác',
];

const STATUSES = ['Chưa Ôn', 'Đã Ôn'];

const LIMITS = [20, 50, 100];

export default function FilterBar({ filters, onFilter, onLimitChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* HSK Level */}
      <select
        className="select select-bordered"
        value={filters.hskLevel}
        onChange={(e) => onFilter('hskLevel', e.target.value)}
      >
        <option value="">Tất Cả Trình Độ</option>
        {HSK_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      {/* Word Type */}
      <select
        className="select select-bordered"
        value={filters.type}
        onChange={(e) => onFilter('type', e.target.value)}
      >
        <option value="">Tất Cả Từ Loại</option>
        {WORD_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {/* Status */}
      <select
        className="select select-bordered"
        value={filters.status}
        onChange={(e) => onFilter('status', e.target.value)}
      >
        <option value="">Tất Cả Trạng Thái</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {/* Limit */}
      <select
        className="select select-bordered"
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
  );
}
