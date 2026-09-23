import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pronunciationRules from '../../../chinese-pronunciation-rules.json';
import PronunciationCard from '../components/PronunciationCard';
import ToneChart from '../components/ToneChart';

const TABS = [
  {
    key: 'tones',
    label: '声调 Thanh Điệu',
    categories: ['Thanh điệu', 'Biến điệu'],
  },
  { key: 'initials', label: '声母 Phụ Âm', categories: ['Âm đầu'] },
  {
    key: 'finals',
    label: '韵母 Nguyên Âm',
    categories: ['Âm cuối', 'Âm mũi cuối vần', 'Âm đặc biệt'],
  },
  {
    key: 'pinyin',
    label: '拼音 Quy Tắc Pinyin',
    categories: ['Quy tắc chính tả pinyin'],
  },
];

// Map title → đường cong mini, chỉ áp dụng cho 5 thanh điệu
const TONE_CURVES = {
  'Thanh thứ nhất — Âm bình (阴平) mā': {
    path: 'M4,8 L56,8',
    color: '#534AB7',
  },
  'Thanh thứ hai — Dương bình (阳平) má': {
    path: 'M4,28 Q30,12 56,8',
    color: '#0F6E56',
  },
  'Thanh thứ ba — Thượng thanh (上声) mǎ': {
    path: 'M4,20 C16,33 24,34 30,33 C40,31 50,14 56,6',
    color: '#993C1D',
  },
  'Thanh thứ tư — Khứ thanh (去声) mà': {
    path: 'M4,8 Q30,20 56,32',
    color: '#993556',
  },
  'Thanh nhẹ (轻声) ma': { path: 'M4,18 L56,18', color: '#5F5E5A' },
};

export default function PronunciationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tones');

  const currentTab = TABS.find((tab) => tab.key === activeTab);
  const items = pronunciationRules.filter((rule) =>
    currentTab.categories.includes(rule.category),
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span>Quay lại</span>
        </button>
        <h1 className="text-2xl font-bold">Phát Âm Tiếng Trung</h1>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Biểu đồ - chỉ hiện ở tab Thanh Điệu */}
      {activeTab === 'tones' && <ToneChart />}

      {/* Danh sách các nguyên tắc */}
      <div className="flex flex-col gap-4">
        {items.map((rule, i) => (
          <PronunciationCard
            key={i}
            rule={rule}
            curve={TONE_CURVES[rule.title]}
          />
        ))}
      </div>
    </div>
  );
}
