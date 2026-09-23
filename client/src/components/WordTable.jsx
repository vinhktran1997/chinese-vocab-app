const SortIcon = ({ field, sort, order }) => {
  if (sort !== field)
    return (
      <span className="text-gray-300 ml-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      </span>
    );
  return (
    <span className="ml-1">
      {order === 'asc' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      )}
    </span>
  );
};

export default function WordTable({
  startIndex,
  words,
  sort,
  order,
  onSort,
  onDelete,
  onEdit,
  onToggleStatus,
  onViewDetail,
}) {
  if (words.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Không tìm thấy từ nào. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th></th>
            <th className="cursor-pointer" onClick={() => onSort('hanzi')}>
              <div className="flex items-center">
                <span>Chữ Hán</span>
                <SortIcon field="hanzi" sort={sort} order={order} />
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('pinyin')}>
              <div className="flex items-center">
                <span>Pinyin</span>
                <SortIcon field="pinyin" sort={sort} order={order} />
              </div>
            </th>
            <th>Từ Loại & Nghĩa</th>
            <th className="cursor-pointer" onClick={() => onSort('hskLevel')}>
              <div className="flex items-center">
                <span>Trình Độ Từ</span>
                <SortIcon field="hskLevel" sort={sort} order={order} />
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('status')}>
              <div className="flex items-center">
                <span>Trạng Thái</span>
                <SortIcon field="status" sort={sort} order={order} />
              </div>
            </th>
            <th>Nguồn</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, i) => (
            <tr key={word._id}>
              <td>{startIndex + i + 1}</td>
              <td className="text-xl">{word.hanzi}</td>
              <td>/{word.pinyin}/</td>
              <td>
                {word.definitions.map((def, i) => (
                  <div key={i} className="max-w-80">
                    <span className="badge badge-outline badge-info badge-sm mr-2">
                      {def.type}
                    </span>
                    <span>{def.meanings.join(', ')}</span>
                  </div>
                ))}
              </td>
              <td>
                <span className="badge badge-primary badge-outline">
                  {word.hskLevel}
                </span>
              </td>
              <td>
                <span
                  className={`badge badge-outline cursor-pointer hover:opacity-70 transition-opacity ${word.status === 'Đã Ôn' ? 'badge-success' : 'badge-secondary'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(word._id);
                  }}
                >
                  {word.status}
                </span>
              </td>
              <td>{word.source}</td>
              <td>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(word);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                      />
                    </svg>
                    <span>Xem Chi Tiết</span>
                  </button>
                  <button
                    className="btn btn-xs btn-warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(word);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                    <span>Chỉnh Sửa</span>
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(word._id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    <span>Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
