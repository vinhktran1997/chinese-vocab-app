export default function Pagination({ pagination, onPageChange }) {
  const { total, page, limit, totalPages } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-gray-500">
        Hiển thị {start}-{end} trong {total} từ
      </span>
      <div className="join">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
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
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        </button>
        <button className="join-item btn btn-sm">
          Trang {page} / {totalPages}
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
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
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
