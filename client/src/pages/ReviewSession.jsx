import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getReviewSession, completeReview } from '../services/wordService';
import useCountdown from '../hooks/useCountdown';
import useSessionStorage from '../hooks/useSessionStorage';

export default function ReviewSession() {
  const COUNTDOWN_SECONDS = 5;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hskLevel = searchParams.get('hskLevel') || '';
  const source = searchParams.get('source') || '';
  const limit = searchParams.get('limit') || 20;
  const mode = searchParams.get('mode') || 'hanzi';

  const [words, setWords] = useSessionStorage('review_words', []);
  const [currentIndex, setCurrentIndex] = useSessionStorage('review_index', 0);
  const [isFlipped, setIsFlipped] = useSessionStorage('review_flipped', false);
  const [remembered, setRemembered] = useSessionStorage(
    'review_remembered',
    [],
  );
  const [forgotten, setForgotten] = useSessionStorage('review_forgotten', []);

  const [loading, setLoading] = useState(() => words.length === 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { timeLeft, reset } = useCountdown(
    COUNTDOWN_SECONDS,
    () => setIsFlipped(true),
    !isFlipped,
  );

  useEffect(() => {
    if (words.length > 0) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await getReviewSession(hskLevel, source, limit);
        setWords(res.data.words);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Không thể tải dữ liệu ôn tập.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWord = words[currentIndex];
  const isLastCard = currentIndex === words.length - 1;
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;

  const handleFlip = () => setIsFlipped(true);

  const handleAnswer = async (didRemember) => {
    const id = currentWord._id;
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
        await completeReview(finalRemembered, finalForgotten);
        clearReviewSession();
        navigate('/review/result', {
          state: {
            remembered: finalRemembered.length,
            forgotten: finalForgotten.length,
            hskLevel,
          },
        });
      } catch {
        setError('Lưu kết quả thất bại. Vui lòng thử lại.');
        setSaving(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      reset();
    }
  };

  const clearReviewSession = () => {
    [
      'review_words',
      'review_index',
      'review_flipped',
      'review_remembered',
      'review_forgotten',
    ].forEach((key) => sessionStorage.removeItem(key));
  };

  const handleExit = () => {
    clearReviewSession();
    navigate('/review');
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
        <button className="btn btn-ghost mt-4" onClick={handleExit}>
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
        <button className="btn btn-ghost btn-sm" onClick={handleExit}>
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
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      <progress
        className="progress progress-primary w-full mb-6"
        value={progress}
        max={100}
      />

      {/* Flashcard */}
      <div className="card bg-base-100 shadow-xl min-h-72 flex flex-col justify-between p-8 mb-6">
        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="text-center">
              {mode === 'hanzi' && (
                <>
                  <p className="text-2xl font-medium text-primary mb-2">
                    {currentWord.pinyin}
                  </p>
                  {currentWord.definitions.map((def, i) => (
                    <div key={i} className="mt-2">
                      <span className="badge badge-outline badge-info badge-sm mr-2">
                        {def.type}
                      </span>
                      <span className="text-base-content/80">
                        {def.meanings.join(', ')}
                      </span>
                    </div>
                  ))}
                </>
              )}
              {mode === 'pinyin' && (
                <>
                  <p className="text-2xl font-medium text-primary mb-2">
                    {currentWord.hanzi}
                  </p>
                  {currentWord.definitions.map((def, i) => (
                    <div key={i} className="mt-2">
                      <span className="badge badge-outline badge-info badge-sm mr-2">
                        {def.type}
                      </span>
                      <span className="text-base-content/80">
                        {def.meanings.join(', ')}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="flex flex-col items-center gap-3 mt-6">
              <button className="btn btn-primary" onClick={handleFlip}>
                {mode === 'hanzi' ? 'Xem Chữ Hán' : 'Xem Pinyin'}
              </button>
              <div className="badge badge-dash badge-info font-mono">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <div className="flex items-center gap-1">
                  <span className="countdown">
                    <span
                      style={{
                        '--value': timeLeft,
                        '--digits': 2,
                      }}
                      aria-live="polite"
                      aria-label="counter"
                    >
                      {timeLeft}
                    </span>
                  </span>
                  <span>seconds</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-6xl font-semibold">{currentWord.hanzi}</p>
            <p className="text-xl text-primary">{currentWord.pinyin}</p>
            {currentWord.definitions.map((def, i) => (
              <div key={i} className="mt-2">
                <span className="badge badge-outline badge-info badge-sm mr-2">
                  {def.type}
                </span>
                <span className="text-base-content/80">
                  {def.meanings.join(', ')}
                </span>
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
