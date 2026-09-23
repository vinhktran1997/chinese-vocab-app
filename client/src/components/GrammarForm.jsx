import {
  HSK_LEVELS,
  CATEGORIES,
  emptyExample,
} from '../utils/grammarFormUtils';

export default function GrammarForm({ formData, onChange, error }) {
  const handleChange = (field, value) =>
    onChange({ ...formData, [field]: value });

  const handleExampleChange = (index, field, value) => {
    const updated = [...formData.examples];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, examples: updated });
  };

  const addExample = () => {
    onChange({
      ...formData,
      examples: [...formData.examples, { ...emptyExample }],
    });
  };

  const removeExample = (index) => {
    onChange({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="label-text font-medium">Tiêu Đề (*)</label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="e.g. Cấu trúc 把 (bǎ)"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Structure */}
      <div className="flex flex-col gap-2">
        <label className="label-text font-medium">Cấu Trúc (*)</label>
        <input
          type="text"
          className="input input-bordered font-mono"
          placeholder="e.g. 主语 + 把 + 宾语 + 动词 + 补语"
          value={formData.structure}
          onChange={(e) => handleChange('structure', e.target.value)}
        />
      </div>

      {/* Explanation */}
      <div className="flex flex-col gap-2">
        <label className="label-text font-medium">Giải Thích (*)</label>
        <textarea
          className="textarea textarea-bordered min-h-24"
          placeholder="Giải thích ý nghĩa và cách dùng..."
          value={formData.explanation}
          onChange={(e) => handleChange('explanation', e.target.value)}
        />
      </div>

      {/* Category + HSK Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="label-text font-medium">Danh Mục (*)</label>
          <select
            className="select select-bordered"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Chọn Danh Mục</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="label-text font-medium">Trình Độ</label>
          <select
            className="select select-bordered"
            value={formData.hskLevel}
            onChange={(e) => handleChange('hskLevel', e.target.value)}
          >
            {HSK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Examples */}
      <div className="flex flex-col gap-2">
        <label className="label-text font-medium">Ví Dụ (*)</label>
        <div className="flex flex-col gap-3">
          {formData.examples.map((example, index) => (
            <div
              key={index}
              className="border border-base-300 rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-base-content/50">
                  Ví Dụ {index + 1}
                </span>
                {formData.examples.length > 1 && (
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => removeExample(index)}
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
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Chữ Hán - e.g. 我把作业做完了。"
                value={example.hanzi}
                onChange={(e) =>
                  handleExampleChange(index, 'hanzi', e.target.value)
                }
              />
              <input
                type="text"
                className="input input-bordered input-sm font-mono"
                placeholder="Pinyin — e.g. Wǒ bǎ zuòyè zuò wán le."
                value={example.pinyin}
                onChange={(e) =>
                  handleExampleChange(index, 'pinyin', e.target.value)
                }
              />
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Nghĩa — e.g. Tôi đã làm xong bài tập."
                value={example.meaning}
                onChange={(e) =>
                  handleExampleChange(index, 'meaning', e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <button
          className="btn btn-outline btn-sm w-fit mt-1"
          onClick={addExample}
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

          <span>Thêm Ví Dụ</span>
        </button>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label className="label-text font-medium">Ghi Chú</label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Lưu ý đặc biệt (không bắt buộc)..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>
    </div>
  );
}
