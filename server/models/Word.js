const mongoose = require("mongoose");

const splitHanzi = (hanzi) => {
  return [...hanzi].filter((c) => /[\u4e00-\u9fff]/.test(c));
};

// Normalize (remove the tone mark on hanzi)
const removeTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const definitionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
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
    ],
    required: true,
  },
  meanings: [{ type: String }],
});

const wordSchema = new mongoose.Schema({
  hanzi: { type: String, required: true },
  characters: [{ type: String }],
  pinyin: { type: String, required: true },
  pinyinNormalized: { type: String },
  definitions: [definitionSchema],
  usagePatterns: [
    {
      structure: { type: String, required: true },
      explanation: { type: String },
      examples: [
        {
          hanzi: { type: String, required: true },
          pinyin: { type: String, required: true },
          meaning: { type: String, required: true },
        },
      ],
    },
  ],
  hskLevel: {
    type: String,
    enum: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7-9", "Khác"],
    default: "Khác",
  },
  source: { type: String },
  status: { type: String, enum: ["Chưa Ôn", "Đã Ôn"], default: "Chưa Ôn" },
  reviewCount: { type: Number, default: 0 },
  lastReviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Auto-split 'hanzi' into 'characters' before save
wordSchema.pre("save", async function () {
  if (this.hanzi) {
    this.characters = splitHanzi(this.hanzi);
  }
  if (this.pinyin) {
    this.pinyinNormalized = removeTones(this.pinyin);
  }
});

module.exports = {
  Word: mongoose.model("Word", wordSchema),
  splitHanzi,
  removeTones,
};
