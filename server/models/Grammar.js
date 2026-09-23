const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  structure: { type: String, required: true },
  explanation: { type: String, required: true },
  category: { type: String, required: true },
  hskLevel: {
    type: String,
    enum: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7-9'],
    default: 'HSK1',
  },
  examples: [
    {
      hanzi: { type: String, required: true },
      pinyin: { type: String, required: true },
      meaning: { type: String, required: true },
    },
  ],
  notes: { type: String },
  status: { type: String, enum: ['Chưa Ôn', 'Đã Ôn'], default: 'Chưa Ôn' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { Grammar: mongoose.model('Grammar', grammarSchema) };
