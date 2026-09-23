import SpeakButton from './SpeakButton';

export default function PronunciationCard({ rule, curve }) {
  return (
    <div className="card bg-base-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="badge badge-outline badge-sm mb-1">
            {rule.category}
          </span>
          <h3 className="font-semibold text-lg">{rule.title}</h3>
        </div>
        {curve && (
          <svg viewBox="0 0 60 36" className="w-14 h-9 shrink-0">
            <path
              d={curve.path}
              fill="none"
              stroke={curve.color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Ví dụ + nút loa */}
      {rule.examples?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {rule.examples.map((example, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-base-200 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-xl">{example.hanzi}</p>
                <p className="text-sm font-mono text-primary">
                  {example.pinyin}
                </p>
                <p className="text-xs text-base-content/50">
                  {example.meaning}
                </p>
              </div>
              <SpeakButton text={example.hanzi} />
            </div>
          ))}
        </div>
      )}

      {/* Mô tả */}
      <p className="text-sm leading-relaxed">{rule.discription}</p>

      {/* Quy tắc chi tiết */}
      {rule.rules?.length > 0 && (
        <ul className="text-sm list-disc list-inside flex flex-col gap-1 text-base-content/80">
          {rule.rules.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      )}

      {/* Lỗi thường gặp */}
      {rule.commonMistakes && (
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="size-5 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <div>
            <p className="font-medium text-sm">Lỗi thường gặp</p>
            <p className="text-sm">{rule.commonMistakes}</p>
          </div>
        </div>
      )}

      {/* So sánh tiếng Việt */}
      {rule.vietnameseComparison && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="size-5 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m6.334-12.138a45.97 45.97 0 0 1 3.539 12.138"
            />
          </svg>
          <div>
            <p className="font-medium text-sm">So sánh với tiếng Việt</p>
            <p className="text-sm">{rule.vietnameseComparison}</p>
          </div>
        </div>
      )}

      {/* Mẹo ghi nhớ */}
      {rule.tips && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="size-5 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <div>
            <p className="font-medium text-sm">Mẹo ghi nhớ</p>
            <p className="text-sm">{rule.tips}</p>
          </div>
        </div>
      )}
    </div>
  );
}
