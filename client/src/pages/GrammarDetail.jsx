import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getGrammar,
  deleteGrammar,
  toggleGrammarStatus,
} from '../services/grammarService';
import { toast } from 'sonner';

export default function GrammarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [grammar, setGrammar] = useState(null);
  const [loading, setLoading] = useState(true);

  const ids = useMemo(() => location.state?.ids || [], [location.state?.ids]);
  const currentIndex = location.state?.currentIndex ?? -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < ids.length - 1;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getGrammar(id);
        setGrammar(res.data);
      } catch {
        toast.error('Không thể tải dữ liệu!');
        navigate('/grammar');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleNavigate = useCallback(
    (index) => {
      navigate(`/grammar/${ids[index]}`, {
        state: { ids, currentIndex: index },
      });
    },
    [ids, navigate],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if users input the data in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft' && hasPrev) handleNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && hasNext) handleNavigate(currentIndex + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, handleNavigate]);

  const handleToggleStatus = async () => {
    try {
      const res = await toggleGrammarStatus(id);
      setGrammar(res.data);
      toast.success(`Đã đổi sang "${res.data.status}"`);
    } catch {
      toast.error('Cập nhật thất bại!');
    }
  };

  const handleDelete = () => {
    toast('Bạn có chắc muốn xóa điểm ngữ pháp này không?', {
      action: {
        label: 'Xóa',
        onClick: async () => {
          try {
            await deleteGrammar(id);
            toast.success('Xóa thành công!');
            if (hasNext) {
              handleNavigate(currentIndex + 1);
            } else if (hasPrev) {
              handleNavigate(currentIndex - 1);
            } else {
              navigate('/grammar');
            }
          } catch {
            toast.error('Xóa thất bại!');
          }
        },
      },
      cancel: { label: 'Hủy' },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  if (!grammar) return null;
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center btn btn-ghost btn-sm"
          onClick={() => navigate('/grammar')}
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
          <span>Quay Lại</span>
        </button>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm btn-outline ${grammar.status === 'Đã Ôn' ? 'btn-success' : 'btn-secondary'}`}
            onClick={handleToggleStatus}
          >
            {grammar.status}
          </button>
          <button className="btn btn-sm btn-error" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3">
        {ids.length > 0 && (
          <button
            className="flex justify-center items-center btn shadow"
            onClick={() => handleNavigate(currentIndex - 1)}
            disabled={!hasPrev}
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
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            <span>Về Trước</span>
          </button>
        )}

        <div className="card bg-base-100 shadow-md p-6 flex flex-col gap-5">
          {/* Title + Badges */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-primary">{grammar.hskLevel}</span>
              <span className="badge badge-outline">{grammar.category}</span>
            </div>
            <h1 className="text-2xl font-bold">{grammar.title}</h1>
          </div>

          {/* Structure */}
          <div className="bg-base-200 rounded-lg p-4">
            <p className="text-xs text-base-content/50 mb-1">Cấu Trúc</p>
            <p className="font-mono text-lg text-primary">
              {grammar.structure}
            </p>
          </div>

          {/* Explanation */}
          <div>
            <p className="text-xs text-base-content/50 mb-1">Giải Thích</p>
            <p className="text-base-content leading-relaxed">
              {grammar.explanation}
            </p>
          </div>

          {/* Examples */}
          <div>
            <p className="text-xs text-base-content/50 mb-2">Ví Dụ</p>
            <div className="flex flex-col gap-3">
              {grammar.examples.map((example, i) => (
                <div key={i} className="border border-base-300 rounded-lg p-3">
                  <p className="text-xl font-medium">{example.hanzi}</p>
                  <p className="text-primary text-sm mt-1">{example.pinyin}</p>
                  <p className="text-base-content/70 text-sm mt-1">
                    {example.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {grammar.notes && (
            <div className="alert alert-info">
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
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>
              <span>{grammar.notes}</span>
            </div>
          )}
        </div>

        {ids.length > 0 && (
          <button
            className="flex item-center btn shadow"
            onClick={() => handleNavigate(currentIndex + 1)}
            disabled={!hasNext}
          >
            <span>Kế Tiếp</span>
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
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
