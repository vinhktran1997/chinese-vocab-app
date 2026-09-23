export const HSK_LEVELS = [
  "HSK1",
  "HSK2",
  "HSK3",
  "HSK4",
  "HSK5",
  "HSK6",
  "HSK7-9",
  "Khác",
];
export const WORD_TYPES = [
  "Danh Từ",
  "Động Từ",
  "Động Từ Li Hợp",
  "Tính Từ",
  "Phó Từ",
  "Đại Từ",
  "Lượng Từ",
  "Số Từ",
  "Trợ Từ",
  "Giới Từ",
  "Liên Từ",
  "Cụm Từ",
  "Động Từ/Danh Từ",
  "Danh Từ (Phương vị từ)",
  "Danh Từ Chỉ Vị Trí",
  "Danh Từ Chỉ Thời Gian",
  "Thán Từ",
  "Câu",
  "Từ Tượng Thanh",
  "Thành Ngữ",
  "Khác",
];
export const SOURCES = ["Quyển 1", "Quyển 2", "Quyển 3", "Quyển 4", "Quyển 5"];

export const emptyUsageExample = { hanzi: "", pinyin: "", meaning: "" };
export const emptyUsagePattern = {
  structure: "",
  explanation: "",
  examples: [{ ...emptyUsageExample }],
};

export const emptyFormData = {
  hanzi: "",
  pinyin: "",
  hskLevel: "Khác",
  source: "Quyển 1",
  definitions: [{ type: "", meanings: "" }],
  usagePatterns: [],
};

export const wordToFormData = (word) => ({
  hanzi: word.hanzi,
  pinyin: word.pinyin,
  hskLevel: word.hskLevel,
  source: word.source || "",
  definitions: word.definitions.map((def) => ({
    type: def.type,
    meanings: def.meanings.join("/"),
  })),
  usagePatterns: (word.usagePatterns || []).map((pattern) => ({
    structure: pattern.structure,
    explanation: pattern.explanation || "",
    examples: pattern.examples.map((ex) => ({
      hanzi: ex.hanzi,
      pinyin: ex.pinyin,
      meaning: ex.meaning,
    })),
  })),
});

export const formDataToPayload = (formData) => ({
  ...formData,
  hanzi: formData.hanzi.trim(),
  definitions: formData.definitions.map((def) => ({
    type: def.type,
    meanings: def.meanings
      .split("/")
      .map((m) => m.trim())
      .filter(Boolean),
  })),
});

export const validateForm = (formData) => {
  if (!formData.hanzi.trim()) return "Vui lòng nhập chữ Hán";
  if (!formData.pinyin.trim()) return "Vui lòng nhập pinyin";
  if (formData.definitions.length === 0)
    return "Vui lòng thêm ít nhất một định nghĩa";
  for (const def of formData.definitions) {
    if (!def.type) return "Vui lòng chọn từ loại";
    if (!def.meanings.trim()) return "Vui lòng nhập nghĩa";
  }
  for (const pattern of formData.usagePatterns) {
    if (!pattern.structure.trim()) return "Vui lòng nhập cấu trúc sử dụng";
    if (pattern.examples.length === 0)
      return "Vui lòng thêm ít nhất một ví dụ cho cấu trúc sử dụng";
    for (const ex of pattern.examples) {
      if (!ex.hanzi.trim())
        return "Vui lòng nhập ví dụ chữ Hán cho cấu trúc sử dụng";
      if (!ex.pinyin.trim())
        return "Vui lòng nhập ví dụ pinyin cho cấu trúc sử dụng ";
      if (!ex.meaning.trim())
        return "Vui lòng nhập nghĩa ví dụ cho cấu trúc sử dụng";
    }
  }
  return "";
};
