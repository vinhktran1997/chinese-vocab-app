import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { importGrammars } from '../services/grammarService';
import { toast } from 'sonner';

export default function ImportGrammar() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('idle'); // 'idle' | 'preview' | 'result'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]); // parsed JSON array
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.json')) {
      setError('Chỉ chấp nhận file .json');
      return;
    }

    setError('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) {
          setError(
            'File JSON phải là một array. Ví dụ: [{ "title": "..." }, ...]',
          );
          return;
        }
        setPreview(parsed);
        setStep('preview');
      } catch {
        setError('File JSON không hợp lệ. Vui lòng kiểm tra lại định dạng.');
      }
    };
    reader.readAsText(selectedFile, 'UTF-8');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    readFile(e.dataTransfer.files[0]);
  };

  const handleConfirmImport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await importGrammars(preview);
      setResult(res.data);
      setStep('result');
      toast.success(res.data.message);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Import thất bại. Vui lòng thử lại.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('idle');
    setFile(null);
    setPreview([]);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button className="btn btn-ghost" onClick={() => navigate('/grammar')}>
          ← Quay lại
        </button>
        <h1 className="text-2xl font-bold">Import Ngữ Pháp</h1>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Step: idle */}
      {step === 'idle' && (
        <div className="card bg-base-100 shadow-md p-8">
          {/* Vùng kéo thả */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary'}`}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12 text-base-content/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <div className="text-center">
              <p className="font-medium">
                Kéo thả file vào đây hoặc click để chọn
              </p>
              <p className="text-sm text-base-content/50 mt-1">
                Chỉ hỗ trợ file .json
              </p>
            </div>
            <button className="btn btn-primary btn-sm">Chọn File</button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".json"
            onChange={(e) => readFile(e.target.files[0])}
          />

          {/* Hướng dẫn cấu trúc file */}
          <div className="mt-6">
            <p className="font-medium mb-2 text-sm">
              Cấu trúc file JSON yêu cầu:
            </p>
            <pre className="bg-base-200 rounded-lg p-4 text-xs overflow-x-auto">
              {`[
  {
    "title": "Cấu trúc 把 (bǎ)",
    "structure": "主语 + 把 + 宾语 + 动词 + 补语",
    "explanation": "Giải thích cách dùng...",
    "category": "Cấu trúc câu",
    "hskLevel": "HSK3",
    "examples": [
      {
        "hanzi": "我把作业做完了。",
        "pinyin": "Wǒ bǎ zuòyè zuò wán le.",
        "meaning": "Tôi đã làm xong bài tập."
      }
    ],
    "notes": "Lưu ý đặc biệt (không bắt buộc)"
  }
]`}
            </pre>
          </div>
        </div>
      )}

      {/* Step: preview */}
      {step === 'preview' && (
        <div className="card bg-base-100 shadow-md p-6">
          {/* File info */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-base-content/50">
                {preview.length} điểm ngữ pháp
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              Chọn file khác
            </button>
          </div>

          {/* Preview cards — hiển thị 3 điểm đầu */}
          <div className="flex flex-col gap-3 mb-4">
            {preview.slice(0, 3).map((item, i) => (
              <div key={i} className="border border-base-300 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-primary badge-sm">
                    {item.hskLevel}
                  </span>
                  <span className="badge badge-outline badge-sm">
                    {item.category}
                  </span>
                </div>
                <p className="font-medium">{item.title}</p>
                <p className="font-mono text-sm text-primary mt-1">
                  {item.structure}
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  {item.examples?.length || 0} ví dụ
                </p>
              </div>
            ))}
          </div>

          {preview.length > 3 && (
            <p className="text-sm text-base-content/50 mb-4">
              ... và {preview.length - 3} điểm ngữ pháp khác
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button className="btn btn-ghost" onClick={handleReset}>
              Hủy
            </button>
            <button
              className="btn btn-primary"
              onClick={handleConfirmImport}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                `Xác Nhận Import ${preview.length} điểm ngữ pháp`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step: result */}
      {step === 'result' && result && (
        <div className="card bg-base-100 shadow-md p-8 flex flex-col items-center gap-6">
          <div className="text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Import Hoàn Tất!</h2>
          <div className="stats stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Điểm mới</div>
              <div className="stat-value text-success">{result.inserted}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Đã cập nhật</div>
              <div className="stat-value text-info">{result.updated}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={handleReset}>
              Import thêm
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/grammar')}
            >
              Xem Danh Sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
