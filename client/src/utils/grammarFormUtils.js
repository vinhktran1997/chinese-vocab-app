export const HSK_LEVELS = [
  'HSK1',
  'HSK2',
  'HSK3',
  'HSK4',
  'HSK5',
  'HSK6',
  'HSK7-9',
];
export const CATEGORIES = [
  'Cấu Trúc Câu',
  'Phủ Định',
  'Câu Hỏi',
  'Phó Từ',
  'Trợ Từ',
  'Thời Gian',
  'Địa Điểm',
  'Động Từ Modal',
  'Lượng Từ',
  'So Sánh',
  'Nhấn Mạnh',
  'Bổ Ngữ',
  'Liên Từ',
  'Mức Độ',
  'Câu Lịch Sự',
];
export const emptyExample = { hanzi: '', pinyin: '', meaning: '' };

export const emptyFormData = {
  title: '',
  structure: '',
  explanation: '',
  category: '',
  hskLevel: 'HSK1',
  note: '',
  examples: [{ ...emptyExample }],
};

export const grammarToFormData = (grammar) => ({
  title: grammar.title,
  structure: grammar.structure,
  explanation: grammar.explanation,
  category: grammar.category,
  hskLevel: grammar.hskLevel,
  notes: grammar.notes || '',
  examples: grammar.examples.map((example) => ({
    hanzi: example.hanzi,
    pinyin: example.pinyin,
    meaning: example.meaning,
  })),
});

export const validateGrammarForm = (formData) => {
  if (!formData.title.trim()) return 'Vui lòng nhập tiêu đề';
  if (!formData.structure.trim()) return 'Vui lòng nhập cấu trúc ngữ pháp';
  if (!formData.explanation.trim()) return 'Vui lòng nhập giải thích ngữ pháp';
  if (!formData.category) return 'Vui lòng chọn danh mục';
  if (!formData.examples.length === 0) return 'Vui lòng thêm ít nhất một ví dụ';
  for (const example of formData.examples) {
    if (!example.hanzi.trim()) return 'Vui lòng nhập chữ Hán cho ví dụ';
    if (!example.pinyin.trim()) return 'Vui lòng nhập pinyin cho ví dụ';
    if (!example.meaning.trim()) return 'Vui lòng nhập nghĩa cho ví dụ';
  }
  return '';
};
