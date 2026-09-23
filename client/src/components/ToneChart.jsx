const TONES = [
  {
    color: '#534AB7',
    path: 'M35,25 L275,25',
    label: 'Thanh 1 — cao bằng phẳng',
  },
  {
    color: '#0F6E56',
    path: 'M35,85 Q155,40 275,25',
    label: 'Thanh 2 — thấp lên cao',
  },
  {
    color: '#993C1D',
    path: 'M35,115 C95,148 135,152 165,150 C205,147 235,90 275,55',
    label: 'Thanh 3 — xuống rồi lên',
  },
  {
    color: '#993556',
    path: 'M35,25 Q155,85 275,145',
    label: 'Thanh 4 — cao xuống thấp',
  },
];

const LEVELS = [
  { y: 25, label: 5 },
  { y: 55, label: 4 },
  { y: 85, label: 3 },
  { y: 115, label: 2 },
  { y: 145, label: 1 },
];

export default function ToneChart() {
  return (
    <div className="card bg-base-100 shadow-sm p-4 mb-4">
      <svg
        viewBox="0 0 300 175"
        className="w-full max-w-md mx-auto text-base-content"
      >
        {/* Gridlines + nhãn bậc */}
        {LEVELS.map(({ y, label }) => (
          <g key={y}>
            <line
              x1="35"
              y1={y}
              x2="275"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeDasharray="3 3"
            />
            <text
              x="27"
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              fontSize="10"
              fill="currentColor"
              opacity="0.5"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Trục */}
        <line
          x1="35"
          y1="15"
          x2="35"
          y2="155"
          stroke="currentColor"
          strokeOpacity="0.3"
        />
        <line
          x1="35"
          y1="155"
          x2="275"
          y2="155"
          stroke="currentColor"
          strokeOpacity="0.3"
        />

        {/* Đường cong 4 thanh */}
        {TONES.map((t, i) => (
          <path
            key={i}
            d={t.path}
            fill="none"
            stroke={t.color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Chú thích */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {TONES.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-2 text-xs"
          >
            <span
              className="inline-block w-5 h-0.5 rounded"
              style={{ backgroundColor: t.color }}
            />
            <span className="text-base-content/70">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
