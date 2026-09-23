import { useState, useEffect, useRef } from "react";
import {
  getWords,
  deleteWord,
  exportWords,
  toggleStatus,
} from "../services/wordService";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import WordTable from "../components/WordTable";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import EditWord from "../components/EditWord";
import { toast } from "sonner";
import WordDetail from "../components/WordDetail";
import useTheme from "../hooks/useTheme";

export default function WordList() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [words, setWords] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    hskLevel: "",
    type: "",
    status: "",
    sort: "createdAt",
    order: "desc",
    page: 1,
    limit: 20,
  });
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailWord, setDetailWord] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const startIndex = (filters.page - 1) * filters.limit;
  // Fetch words whenever filters change
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const res = await getWords(filters);
        setWords(res.data.words);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (search) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSort = (sort) => {
    const order =
      filters.sort === sort && filters.order === "asc" ? "desc" : "asc";
    setFilters((prev) => ({ ...prev, sort, order, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit: Number(limit), page: 1 }));
  };

  const handleDelete = async (id) => {
    toast("Bạn có chắc muốn xóa từ này không?", {
      action: {
        label: "Xóa",
        onClick: async () => {
          try {
            await deleteWord(id);
            setFilters((prev) => ({ ...prev }));
            toast.success("Xóa từ thành công!");
          } catch {
            toast.error("Xoá từ thất bại. Vui lòng thử lại.");
          }
        },
      },
      cancel: {
        label: "Hủy",
      },
    });
  };

  const handleEdit = (word) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseModal();
    setFilters((prev) => ({ ...prev }));
  };

  const handleExport = (format) => {
    toast(`Bạn có muốn xuất file dưới dạng .${format} không?`, {
      action: {
        label: "Có",
        onClick: async () => {
          try {
            exportWords(format, {
              hskLevel: filters.hskLevel,
              status: filters.status,
              type: filters.type,
            });
            toast.success(`Xuất file ${format.toUpperCase()} thành công!`);
          } catch {
            toast.error("Xuất file thất bại. Vui lòng thử lại.");
          }
        },
      },
      cancel: {
        label: "Không",
      },
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id);
      setFilters((prev) => ({ ...prev }));
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleViewDetail = (word) => {
    setDetailWord(word);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setDetailWord(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Danh Sách Từ Vựng Tiếng Trung</h1>
        <h1 className="flex flex-col items-center cursor-pointer p-2 rounded-md hover:bg-gray-100 hover:shadow">
          <span className="text-xl font-semibold tracking-widest">
            - 陈金荣 -
          </span>
          <span className="text-xs">Xây Dựng Và Phát Triển Bởi</span>
        </h1>
        <div className="flex justify-center items-center gap-2">
          <button
            className="btn btn-ghost btn-circle"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Chuyển sang chế độ tối"
                : "Chuyển sang chế độ sáng"
            }
          >
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364L5.045 7.227M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </button>
          <div className="relative" ref={menuRef}>
            <button
              className="btn btn-outline gap-2"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Tính Năng
            </button>
            {menuOpen && (
              <ul className="absolute right-0 menu bg-base-100 rounded-box shadow-lg w-52 p-2 z-10 mt-1">
                <li>
                  <button
                    onClick={() => {
                      navigate("/add");
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
                    <span>Thêm Từ Mới</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/import");
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
                <div className="divider my-1"></div>
                <li className="menu-title text-sm text-center text-base-content/50 px-2 py-1">
                  Export File
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleExport("xlsx");
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <span>Excel (.xlsx)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleExport("csv");
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <span>CSV (.csv)</span>
                  </button>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={() => {
                      navigate("/review");
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
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                    <span>Ôn Tập Từ Vựng</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/grammar");
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
                    <span>Ngữ Pháp</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/pronunciation");
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
                        d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                      />
                    </svg>

                    <span>Nguyên Tắc Phát Âm</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      <FilterBar
        filters={filters}
        onFilter={handleFilter}
        onLimitChange={handleLimitChange}
      />

      {loading ? (
        <div className="flex justify-center my-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <WordTable
            startIndex={startIndex}
            words={words}
            sort={filters.sort}
            order={filters.order}
            onSort={handleSort}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewDetail={handleViewDetail}
          />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
      {selectedWord && (
        <EditWord
          key={selectedWord._id}
          word={selectedWord}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      <WordDetail
        word={detailWord}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
