import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReviewStats, resetReview } from '../services/wordService';
import { HSK_LEVELS, SOURCES } from '../utils/wordFormUtils';

export default function ReviewSetup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('hanzi');
  const [hskLevel, setHskLevel] = useState('');
  const [source, setSource] = useState('');
  const [limit, setLimit] = useState(20);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getReviewStats(hskLevel, source);
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [hskLevel, source]);

  const handleReset = async () => {
    if (!window.confirm('Làm mới tất cả từ về "Chưa Ôn"?')) return;
    try {
      setResetting(true);
      await resetReview(hskLevel, source);
      const res = await getReviewStats(hskLevel, source);
      setStats(res.data);
    } finally {
      setResetting(false);
    }
  };

  const handleStart = () => {
    [
      'review_words',
      'review_index',
      'review_flipped',
      'review_remembered',
      'review_forgotten',
    ].forEach((key) => sessionStorage.removeItem(key));
    navigate(
      `/review/session?hskLevel=${hskLevel}&source=${source}&limit=${limit}&mode=${mode}`,
    );
  };

  const canStart = stats && stats.unreviewed > 0;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
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
        <h1 className="text-2xl font-bold">Ôn Tập Từ Vựng</h1>
      </div>

      <div className="card bg-base-100 shadow-md p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="label-text font-medium">Chế Độ Ôn Tập</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`btn flex-col h-auto py-4 gap-1 ${mode === 'hanzi' ? 'btn-primary ' : 'btn-outline'}`}
              onClick={() => setMode('hanzi')}
            >
              <span className="text-2xl">汉字</span>
              <span className="text-sm">Luyện Nhớ Chữ Hán</span>
              <span className="text-xs opacity-60">
                Xem pinyin → đoán chữ Hán
              </span>
            </button>
            <button
              className={`btn flex-col h-auto py-4 gap-1 ${mode === 'pinyin' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMode('pinyin')}
            >
              <span className="text-2xl">Pinyin</span>
              <span className="text-sm">Luyện Nhớ Pinyin</span>
              <span className="text-xs opacity-60">
                Xem chữ Hán → đoán pinyin
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
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
          <div className="flex flex-col gap-2">
            <label className="label-text font-medium">Nguồn</label>
            <select
              className="select select-bordered"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">Tất Cả Các Nguồn</option>
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
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
