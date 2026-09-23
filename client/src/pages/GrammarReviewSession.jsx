import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getGrammarReviewSession,
  completeGrammarReview,
} from '../services/grammarService';
import { toast } from 'sonner';

export default function GrammarReviewSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hskLevel = searchParams.get('hskLevel') || '';
  const limit = searchParams.get('limit') || 20;

  const [grammars, setGrammars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [remembered, setRemembered] = useState([]);
  const [forgotten, setForgotten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await getGrammarReviewSession(hskLevel, limit);
        setGrammars(res.data.grammars);
      } catch (error) {
        const err =
          error.response?.data?.message || 'Không thể tải dữ liệu ôn tập!';
        toast.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [hskLevel, limit]);

  const currentGrammar = grammars[currentIndex];
  const isLastCard = currentIndex === grammars.length - 1;
  const progress =
    grammars.length > 0 ? (currentIndex / grammars.length) * 100 : 0;

  const handleFlip = () => setIsFlipped(true);

  const handleAnswer = async (didRemember) => {
    const id = currentGrammar._id;
    if (didRemember) {
      setRemembered((prev) => [...prev, id]);
    } else {
      setForgotten((prev) => [...prev, id]);
    }

    if (isLastCard) {
      try {
        setSaving(true);
        const finalRemembered = didRemember ? [...remembered, id] : remembered;
        const finalForgotten = didRemember ? forgotten : [...forgotten, id];
        await completeGrammarReview(finalRemembered, finalForgotten);
        navigate('/grammar/review/result', {
          state: {
            remembered: finalRemembered.length,
            forgotten: finalForgotten.length,
            hskLevel,
          },
        });
      } catch {
        toast.error('Lưu kết quả thất bại. Vui lòng thử lại.');
        setError('Lưu kết quả thất bại. Vui lòng thử lại.');
        setSaving(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-lg">
        <div className="alert alert-error">{error}</div>
        <button
          className="btn btn-ghost mt-4"
          onClick={() => navigate('/grammar/review')}
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
          <span>Quay lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/grammar/review')}
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
          <span>Thoát</span>
        </button>
        <span className="font-medium">
          {currentIndex + 1} / {grammars.length}
        </span>
      </div>

      <progress
        className="progress progress-primary w-full mb-6"
        value={progress}
        max={100}
      />

      {/* Flashcard */}
      <div className="card bg-base-100 shadow-xl min-h-72 flex flex-col justify-between p-6 mb-6">
        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
            <p className="font-mono text-xl text-primary">
              {currentGrammar.structure}
            </p>
            <p className="text-base-content/60 text-sm">
              {currentGrammar.category} - {currentGrammar.hskLevel}
            </p>
            <button className="btn btn-primary mt-4" onClick={handleFlip}>
              Xem Chi Tiết
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
            <p className="text-xl font-bold">{currentGrammar.title}</p>
            <p className="font-mono text-primary">{currentGrammar.structure}</p>
            <p className="text-sm text-base-content/70">
              {currentGrammar.explanation}
            </p>
            {currentGrammar.examples.slice(0, 2).map((example, i) => (
              <div
                key={i}
                className="text-sm border-l-2 border-primary pl-3 text-left"
              >
                <p>{example.hanzi}</p>
                <p className="text-primary">{example.pinyin}</p>
                <p className="text-base-content/60">{example.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFlipped && (
        <div className="grid grid-cols-2 gap-4">
          <button
            className="btn btn-error btn-lg"
            onClick={() => handleAnswer(false)}
            disabled={saving}
          >
            Không Nhớ
          </button>
          <button
            className="btn btn-success btn-lg"
            onClick={() => handleAnswer(true)}
            disabled={saving}
          >
            Đã Nhớ
          </button>
        </div>
      )}
    </div>
  );
}
