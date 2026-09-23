import { HSK_LEVELS, WORD_TYPES, SOURCES } from "../utils/wordFormUtils";
import { suggestPinyin } from "../utils/pinyinSuggest";
import { emptyUsageExample, emptyUsagePattern } from "../utils/wordFormUtils";
import { useRef, useState } from "react";

export default function WordForm({ formData, onChange, error }) {
  const [pinyinEditable, setPinyinEditable] = useState(false);

  const previousHanziRef = useRef(formData.hanzi);

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleDefinitionChange = (index, field, value) => {
    const updated = [...formData.definitions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, definitions: updated });
  };

  const handleHanziBlur = () => {
    const trimmed = formData.hanzi.trim();

    if (!trimmed) {
      if (!pinyinEditable && formData.pinyin) {
        previousHanziRef.current = "";
        onChange({ ...formData, pinyin: "" });
      }
      return;
    }

    if (trimmed === previousHanziRef.current) return;
    previousHanziRef.current = trimmed;

    if (!pinyinEditable) {
      onChange({ ...formData, pinyin: suggestPinyin(trimmed) });
    }
  };

  const addDefinition = () => {
    onChange({
      ...formData,
      definitions: [...formData.definitions, { type: "", meanings: "" }],
    });
  };

  const removeDefinition = (index) => {
    onChange({
      ...formData,
      definitions: formData.definitions.filter((_, i) => i !== index),
    });
  };

  const handleTogglePinyinEdit = () => {
    setPinyinEditable((prev) => !prev);
  };

  const addUsagePattern = () => {
    onChange({
      ...formData,
      usagePatterns: [...formData.usagePatterns, { ...emptyUsagePattern }],
    });
  };

  const removeUsagePattern = (index) => {
    onChange({
      ...formData,
      usagePatterns: formData.usagePatterns.filter((_, i) => i !== index),
    });
  };

  const handleUsagePatternChange = (index, field, value) => {
    const updated = [...formData.usagePatterns];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, usagePatterns: updated });
  };

  const handleUsageExampleChange = (
    patternIndex,
    exampleIndex,
    field,
    value,
  ) => {
    const updatedPatterns = [...formData.usagePatterns];
    const updatedExamples = [...updatedPatterns[patternIndex].examples];
    updatedExamples[exampleIndex] = {
      ...updatedExamples[exampleIndex],
      [field]: value,
    };
    updatedPatterns[patternIndex] = {
      ...updatedPatterns[patternIndex],
      examples: updatedExamples,
    };
    onChange({ ...formData, usagePatterns: updatedPatterns });
  };

  const addUsageExample = (patternIndex) => {
    const updatedPatterns = [...formData.usagePatterns];
    updatedPatterns[patternIndex] = {
      ...updatedPatterns[patternIndex],
      examples: [
        ...updatedPatterns[patternIndex].examples,
        { ...emptyUsageExample },
      ],
    };
    onChange({ ...formData, usagePatterns: updatedPatterns });
  };

  const removeUsageExample = (patternIndex, exampleIndex) => {
    const updatedPatterns = [...formData.usagePatterns];
    updatedPatterns[patternIndex] = {
      ...updatedPatterns[patternIndex],
      examples: updatedPatterns[patternIndex].examples.filter(
        (_, i) => i !== exampleIndex,
      ),
    };
    onChange({ ...formData, usagePatterns: updatedPatterns });
  };

  const handleUsageExampleHanziBlur = (patternIndex, exampleIndex) => {
    const example = formData.usagePatterns[patternIndex].examples[exampleIndex];
    const trimmed = example.hanzi.trim();

    if (trimmed && !example.pinyin.trim()) {
      // Handle the case where both hanzi and pinyin are empty
      handleUsageExampleChange(
        patternIndex,
        exampleIndex,
        "pinyin",
        suggestPinyin(trimmed),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Error */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      {/* Hanzi */}
      <div className="flex flex-col gap-3">
        <label className="label">
          <span className="label-text font-medium">Chữ Hán *</span>
        </label>
        <input
          type="text"
          placeholder="e.g. 学习"
          className="input input-bordered w-full"
          value={formData.hanzi}
          onChange={(e) => handleChange("hanzi", e.target.value)}
          onBlur={handleHanziBlur}
        />
      </div>
      {/* Pinyin */}
      <div className="flex flex-col gap-3">
        <label className="label">
          <span className="label-text font-medium">Pinyin *</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. xuéxí"
            className="input input-bordered w-full flex-1"
            value={formData.pinyin}
            onChange={(e) => handleChange("pinyin", e.target.value)}
            disabled={!pinyinEditable}
          />
          <button
            type="button"
            className={`btn btn-sm ${pinyinEditable ? "btn-primary" : "btn-outline"}`}
            onClick={handleTogglePinyinEdit}
          >
            {pinyinEditable ? "Tắt Chỉnh Sửa Pinyin" : "Mở Chỉnh Sửa Pinyin"}
          </button>
        </div>
      </div>
      {/* Level + Source */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <label className="label">
            <span className="label-text font-medium">Trình Độ</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.hskLevel}
            onChange={(e) => handleChange("hskLevel", e.target.value)}
          >
            {HSK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="label">
            <span className="label-text font-medium">Nguồn</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.source}
            onChange={(e) => handleChange("source", e.target.value)}
          >
            {SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Definitions */}
      <div className="flex flex-col gap-3">
        <label className="label">
          <span className="label-text font-medium">Định Nghĩa *</span>
          <span className="label-text-alt text-gray-400">
            Nhiều nghĩa cách nhau bởi /
          </span>
        </label>

        <div className="flex flex-col gap-3">
          {formData.definitions.map((def, index) => (
            <div key={index} className="flex gap-2 items-start">
              {/* Word Type */}
              <select
                className="select select-bordered w-48"
                value={def.type}
                onChange={(e) =>
                  handleDefinitionChange(index, "type", e.target.value)
                }
              >
                <option value="">Từ Loại</option>
                {WORD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {/* Meanings */}
              <input
                type="text"
                placeholder="e.g. học tập, học hỏi"
                className="input input-bordered flex-1"
                value={def.meanings}
                onChange={(e) =>
                  handleDefinitionChange(index, "meanings", e.target.value)
                }
              />
              {/* Delete definition */}
              {formData.definitions.length > 1 && (
                <button
                  className="btn btn-ghost btn-square text-error"
                  onClick={() => removeDefinition(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
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
          ))}
        </div>

        {/* Add definition */}
        <button
          className="btn btn-outline btn-sm mt-3 w-fit"
          onClick={addDefinition}
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
          <span>Thêm định nghĩa</span>
        </button>
      </div>

      {/* Structure */}
      <div className="flex flex-col gap-2">
        <label className="label">
          <span className="label-text font-medium">Cấu Trúc Sử Dụng Từ</span>
          <span className="label-text-alt text-gray-400">(Nếu Có)</span>
        </label>

        <div className="flex flex-col gap-3">
          {formData.usagePatterns.map((pattern, patternIndex) => (
            <div
              key={patternIndex}
              className="border border-base-300 rounded p-3 flex flex-col gap-2"
            >
              {/* Structure Header */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-base-content/50">
                  Cấu Trúc {patternIndex + 1}
                </span>
                <button
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => removeUsagePattern(patternIndex)}
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
              </div>

              {/* Structure Input */}
              <input
                type="text"
                placeholder="e.g. Chủ Ngữ + 很 + Tính Từ"
                className="input input-bordered input-sm font-mono"
                value={pattern.structure}
                onChange={(e) =>
                  handleUsagePatternChange(
                    patternIndex,
                    "structure",
                    e.target.value,
                  )
                }
              />

              {/* Structure Explanation */}
              <input
                type="text"
                className="input input-bordered input-sm font-mono"
                placeholder="Giải thích (tùy chọn)"
                value={pattern.explanation}
                onChange={(e) =>
                  handleUsagePatternChange(
                    patternIndex,
                    "explanation",
                    e.target.value,
                  )
                }
              />

              {/* Structure Examples */}
              <div className="flex flex-col gap-2 pl-3 border-l-2 border-base-300">
                {pattern.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-base-content/50">
                        Ví dụ {exampleIndex + 1}
                      </span>
                      {pattern.examples.length > 1 && (
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() =>
                            removeUsageExample(patternIndex, exampleIndex)
                          }
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
                    {/* Hanzi Example */}
                    <input
                      type="text"
                      placeholder="Chữ Hán - e.g. 她很漂亮"
                      className="input input-bordered input-sm font-mono"
                      value={example.hanzi}
                      onChange={(e) =>
                        handleUsageExampleChange(
                          patternIndex,
                          exampleIndex,
                          "hanzi",
                          e.target.value,
                        )
                      }
                      onBlur={() =>
                        handleUsageExampleHanziBlur(patternIndex, exampleIndex)
                      }
                    />
                    {/* Pinyin Example */}
                    <input
                      type="text"
                      placeholder="Pinyin - e.g. tā hěn piàoliang"
                      className="input input-bordered input-sm font-mono"
                      value={example.pinyin}
                      onChange={(e) =>
                        handleUsageExampleChange(
                          patternIndex,
                          exampleIndex,
                          "pinyin",
                          e.target.value,
                        )
                      }
                    />
                    {/* Meaning Example */}
                    <input
                      type="text"
                      placeholder="Nghĩa - e.g. Cô ấy rất đẹp"
                      className="input input-bordered input-sm font-mono"
                      value={example.meaning}
                      onChange={(e) =>
                        handleUsageExampleChange(
                          patternIndex,
                          exampleIndex,
                          "meaning",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-xs w-fit"
                  onClick={() => addUsageExample(patternIndex)}
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
                  <span>Thêm ví dụ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-outline btn-sm mt-1 w-fit"
          onClick={addUsagePattern}
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
          <span>Thêm cấu trúc sử dụng</span>
        </button>
      </div>
    </div>
  );
}
