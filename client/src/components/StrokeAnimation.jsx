import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

export default function StrokeAnimation({ char }) {
  const containerRef = useRef(null);
  const writerRef = useRef(null);
  const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(true);

  const SIZE = 220;

  useEffect(() => {
    if (!containerRef.current || !char) return;

    const container = containerRef.current;

    container.innerHTML = '';
    setError(false);
    // setLoading(true);

    writerRef.current = HanziWriter.create(containerRef.current, char, {
      width: SIZE,
      height: SIZE,
      padding: 10,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 300,
      strokeColor: '#570df8',
      outlineColor: '#dddddd',
      onLoadCharDataError: () => {
        // setLoading(false);
        setError(true);
      },
    });

    writerRef.current.animateCharacter({
      // onComplete: () => setLoading(false),
    });

    return () => {
      container.innerHTML = '';
    };
  }, [char]);

  const handleReplay = () => writerRef.current?.animateCharacter();

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative border border-base-300 bg-base-100"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Lưới 田字格 — đặt phía sau */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          {/* Viền ngoài */}
          <rect
            x="1"
            y="1"
            width={SIZE - 2}
            height={SIZE - 2}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="1"
          />
          {/* Đường chéo */}
          <line
            x1="0"
            y1="0"
            x2={SIZE}
            y2={SIZE}
            stroke="#f0d0d0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1={SIZE}
            y1="0"
            x2="0"
            y2={SIZE}
            stroke="#f0d0d0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* Đường giữa ngang dọc */}
          <line
            x1={SIZE / 2}
            y1="0"
            x2={SIZE / 2}
            y2={SIZE}
            stroke="#f0d0d0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1={SIZE / 2}
            x2={SIZE}
            y2={SIZE / 2}
            stroke="#f0d0d0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>

        {/* HanziWriter vẽ lên trên lưới */}
        <div ref={containerRef} className="absolute inset-0" />

        {/* Loading */}
        {/* {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner" />
          </div>
        )} */}

        {/* Lỗi */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-sm text-base-content/50 text-center">
              Chưa có dữ liệu cách viết cho chữ "{char}"
            </p>
          </div>
        )}
      </div>

      {!error && (
        <button className="btn btn-sm btn-outline" onClick={handleReplay}>
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
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Xem lại
        </button>
      )}
    </div>
  );
}
