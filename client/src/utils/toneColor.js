const TONE_MAP = {
  ā: 1,
  ē: 1,
  ī: 1,
  ō: 1,
  ū: 1,
  ǖ: 1,
  á: 2,
  é: 2,
  í: 2,
  ó: 2,
  ú: 2,
  ǘ: 2,
  ǎ: 3,
  ě: 3,
  ǐ: 3,
  ǒ: 3,
  ǔ: 3,
  ǚ: 3,
  à: 4,
  è: 4,
  ì: 4,
  ò: 4,
  ù: 4,
  ǜ: 4,
};

const TONE_COLOR = {
  1: "#185FA5",
  2: "#3B6D11",
  3: "#854F0B",
  4: "#A32D2D",
};

export const getToneColor = (pinyin) => {
  if (!pinyin) return "#5F5E5A";
  for (const char of pinyin) {
    const tone = TONE_MAP[char];
    if (tone) return TONE_COLOR[tone];
  }
  return "#5F5E5A";
};
