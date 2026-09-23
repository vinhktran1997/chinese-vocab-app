import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGrammars,
  deleteGrammar,
  toggleGrammarStatus,
  getGrammarIds,
} from '../services/grammarService';
import Pagination from '../components/Pagination';
import { toast } from 'sonner';
import { HSK_LEVELS, CATEGORIES } from '../utils/grammarFormUtils';

export default function GrammarList() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [grammars, setGrammars] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    hskLevel: '',
    category: '',
    status: '',
    sort: 'hskLevel',
    order: 'asc',
    page: 1,
    limit: 20,
  });
  const [loading, setLoading] = useState(false);

  const startIndex = (filters.page - 1) * filters.limit;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchGrammars = async () => {
      try {
        setLoading(true);
        const res = await getGrammars(filters);
        console.log(res);
        setGrammars(res.data.grammars);
        setPagination(res.data.pagination);
      } catch {
        toast.error('Không thể tải dữ liệu ngữ pháp!');
      } finally {
        setLoading(false);
      }
    };
    fetchGrammars();
  }, [filters]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleViewDetail = async (id, index) => {
    try {
      const res = await getGrammarIds({
        search: filters.search,
        hskLevel: filters.hskLevel,
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
        order: filters.sorder,
      });

      const allIds = res.data.ids;
      const realIndex = allIds.indexOf(id);

      navigate(`/grammar/${id}`, {
        state: {
          ids: allIds,
          currentIndex: realIndex !== -1 ? realIndex : index,
        },
      });
    } catch {
      navigate(`/grammar/${id}`, {
        state: {
          ids: grammars.map((grammar) => grammar._id),
          currentIndex: index,
        },
      });
    }
  };

  const handleDelete = (id) => {
    toast('Bạn có chắc muốn xóa điểm ngữ pháp này không?', {
      action: {
        label: 'Xoá',
        onClick: async () => {
          try {
            await deleteGrammar(id);
            setFilters((prev) => ({ ...prev }));
            toast.success('Xóa thành công!');
          } catch {
            toast.error('Xóa thất bại!');
          }
        },
      },
      cancel: { label: 'Hủy' },
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleGrammarStatus(id);
      setFilters((prev) => ({ ...prev }));
    } catch {
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Danh Sách Ngữ Pháp Tiếng Trung</h1>
        <h1 className="flex flex-col items-center cursor-pointer p-2 rounded-md hover:bg-gray-100 hover:shadow">
          <span className="text-xl font-semibold tracking-widest">
            - 陈金荣 -
          </span>
          <span className="text-xs">Xây Dựng Và Phát Triển Bởi</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center btn btn-ghost btn-sm"
            onClick={() => navigate('/')}
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span>Quay Lại Trang Từ Vựng</span>
          </button>
          <div className="relative" ref={menuRef}>
            <button
              className="btn btn-outline gap-2"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Tính Năng
            </button>
            {menuOpen && (
              <ul className="absolute right-0 mt-1 menu bg-base-100 rounded-box shadow-lg w-52 p-2 z-10">
                <li>
                  <button
                    onClick={() => {
                      navigate('/grammar/import');
                      setMenuOpen(false);
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
                        d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                      />
                    </svg>
                    <span>Import File</span>
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => {
                      navigate('/grammar/add');
                      setMenuOpen(false);
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>

                    <span>Thêm Ngữ Pháp</span>
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => {
                      navigate('/grammar/review');
                      setMenuOpen(false);
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
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                      />
                    </svg>

                    <span>Ôn Tập Ngữ Pháp</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="input input-bordered flex-1 min-w-48"
          value={filters.search}
          onChange={(e) => handleFilter('search', e.target.value)}
        />
        <select
          className="select select-bordered"
          value={filters.hskLevel}
          onChange={(e) => handleFilter('hskLevel', e.target.value)}
        >
          <option value="">Tất Cả Trình Độ</option>
          {HSK_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered"
          value={filters.category}
          onChange={(e) => handleFilter('category', e.target.value)}
        >
          <option value="">Tất Cả Danh Mục</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered"
          value={filters.status}
          onChange={(e) => handleFilter('status', e.target.value)}
        >
          <option value="">Tất Cả Trạng Thái</option>
          <option value="Chưa Ôn">Chưa Ôn</option>
          <option value="Đã Ôn">Đã Ôn</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center my-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Tiêu Đề</th>
                  <th>Cấu Trúc</th>
                  <th>Danh Mục</th>
                  <th>Trình Độ</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {grammars.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-base-content/50"
                    >
                      Không tìm thấy điểm ngữ pháp nào.
                    </td>
                  </tr>
                ) : (
                  grammars.map((grammar, i) => (
                    <tr
                      key={grammar._id}
                      className="cursor-pointer hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(grammar._id, i);
                      }}
                    >
                      <td>{startIndex + i + 1}</td>
                      <td className="font-medium max-w-48">{grammar.title}</td>
                      <td className="font-mono text-sm text-primary">
                        {grammar.structure}
                      </td>
                      <td>
                        <span className="badge badge-outline badge-sm">
                          {grammar.category}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-primary badge-outline badge-sm">
                          {grammar.hskLevel}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`badge badge-outline badge-sm cursor-pointer hover:opacity-70 ${grammar.status === 'Đã Ôn' ? 'badge-success' : 'badge-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(grammar._id);
                          }}
                        >
                          {grammar.status}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/grammar/${grammar._id}/edit`);
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
                              handleDelete(grammar._id);
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
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
}
