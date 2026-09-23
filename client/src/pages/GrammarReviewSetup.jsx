import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGrammarReviewStats,
  resetGrammarReview,
} from '../services/grammarService';
import { toast } from 'sonner';

const HSK_LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7-9'];

export default function GrammarReviewSetup() {
  const navigate = useNavigate();
  const [hskLevel, setHskLevel] = useState('');
  const [limit, setLimit] = useState(20);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getGrammarReviewStats(hskLevel);
        setStats(res.data);
      } catch {
        toast.error('Không thể tải dữ liệu điểm ngữ pháp!');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [hskLevel]);

  const handleReset = async () => {
    toast(`Bạn có muốn làm mới tất cả điểm ngữ pháp về Chưa Ôn không?`, {
      action: {
        label: 'Có',
        onClick: async () => {
          try {
            setResetting(true);
            await resetGrammarReview(hskLevel);
            const res = await getGrammarReviewStats(hskLevel);
            toast.success('Làm mới thành công!');
            setStats(res.data);
          } finally {
            setResetting(false);
          }
        },
      },
    });
  };

  const handleStart = () => {
    navigate(`/grammar/review/session?hskLevel=${hskLevel}&limit=${limit}`);
  };

  const canStart = stats && stats.unreviewed > 0;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <button className="btn btn-ghost" onClick={() => navigate('/grammar')}>
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
          <span>Quay lại</span>
        </button>
        <h1 className="text-2xl font-bold">Ôn Tập Ngữ Pháp</h1>
      </div>

      <div className="card bg-base-100 shadow-md p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="label-text font-medium">Trình Độ</label>
          <select
            className="select select-bordered"
            value={hskLevel}
            onChange={(e) => setHskLevel(e.target.value)}
          >
            <option value="">Tất Cả Trình Độ</option>
            {HSK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner" />
          </div>
        ) : (
          stats && (
            <div className="stats stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-title">Tổng Số Từ</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Chưa Ôn</div>
                <div className="stat-value text-warning">
                  {stats.unreviewed}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Đã Ôn</div>
                <div className="stat-value text-success">{stats.reviewed}</div>
              </div>
            </div>
          )
        )}

        {stats && stats.total > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm text-base-content/60">
              <span>Tiến độ ôn tập</span>
              <span>{Math.round((stats.reviewed / stats.total) * 100)}%</span>
            </div>
            <progress
              className="progress progress-success w-full"
              value={stats.reviewed}
              max={stats.total}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="label-text font-medium">Số Thẻ Muốn Ôn Tập</label>
          <input
            type="number"
            className="input input-bordered"
            min={1}
            max={stats?.unreviewed || 999}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
          {stats && limit > stats.unreviewed && stats.unreviewed > 0 && (
            <span className="text-sm text-warning">
              Chỉ còn {stats.unreviewed} từ chưa ôn - sẽ ôn tất cả số từ này
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={handleReset}
            disabled={resetting || !stats?.total}
          >
            {resetting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Làm mới về Chưa Ôn'
            )}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={!canStart}
          >
            {stats?.unreviewed === 0
              ? 'Đã Ôn Hết - Hãy Làm Mới!'
              : 'Bất Đầu Ôn Tập'}
          </button>
        </div>
      </div>
    </div>
  );
}
