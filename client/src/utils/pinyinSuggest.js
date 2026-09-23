import { pinyin } from 'pinyin-pro';

export const suggestPinyin = (hanzi) => {
  if (!hanzi?.trim()) return '';
  const result = pinyin(hanzi.trim(), { toneType: 'symbol' });
  return result.replace(/\s+/g, '');
};
