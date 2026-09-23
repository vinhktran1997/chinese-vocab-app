import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { importWords } from '../services/wordService';
import { toast } from 'sonner';

export default function ImportWord() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('idle');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (selectedFile) => {
    if (!selectedFile) return;

    const validExts = ['.xlsx', '.xls', '.csv'];
    const ext = selectedFile.name
      .slice(selectedFile.name.lastIndexOf('.'))
      .toLowerCase();
    if (!validExts.includes(ext)) {
      setError('Chỉ chấp nhận file .xlsx, .xls, hoặc .csv');
      return;
    }
    setError('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      setPreview(rows);
      setStep('preview');
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    readFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConfirmImport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await importWords(file);
      const { inserted, updated } = res.data;
      toast.success(
        `Import hoàn tất: ${inserted} từ mới, ${updated} từ cập nhật`,
      );
      setResult(res.data);
      setStep('result');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Import thất bại. Vui lòng thử lại.';
      toast.error(message);
      setError(message);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center btn btn-ghost"
          onClick={() => navigate('/')}
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span>Quay lại</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Step: idle */}
      {step === 'idle' && (
        <div className="card bg-base-100 shadow-md p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary'}`}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
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
                d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
              />
            </svg>
            <div className="text-center">
              <p className="font-medium">
                Kéo thả file vào đây hoặc click để chọn
              </p>
              <p className="text-sm text-base-content/50 mt-1">
                Hỗ trợ: .xlsx, .xls, .csv
              </p>
            </div>
            <button className="btn btn-primary btn-sm">Chọn File</button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => readFile(e.target.files[0])}
          />

          <div className="mt-6">
            <p className="font-medium mb-2 text-sm">Cấu trúc file yêu cầu:</p>
            <div className="overflow-x-auto">
              <table className="table table-md table-bordered border border-base-300 w-full">
                <thead className="bg-base-200">
                  <tr>
                    {[
                      'hanzi',
                      'pinyin',
                      'level',
                      'type',
                      'meanings',
                      'source',
                    ].map((col) => (
                      <th key={col} className="border border-base-300">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-base-300">学习</td>
                    <td className="border border-base-300">xuéxí</td>
                    <td className="border border-base-300">HSK2</td>
                    <td className="border border-base-300">Động Từ</td>
                    <td className="border border-base-300">học tập, học hỏi</td>
                    <td className="border border-base-300">Quyển 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Step: preview */}
      {step === 'preview' && (
        <div className="card bg-base-100 shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-base-content/50">
                {preview.length} dòng dữ liệu
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              Chọn file khác
            </button>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="table table-zebra table-sm w-full">
              <thead>
                <tr>
                  {Object.keys(preview[0] || {}).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 10 && (
            <p className="text-sm text-base-content/50 mb-4">
              ... và {preview.length - 10} dòng khác
            </p>
          )}
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
                `Xác Nhận Import ${preview.length} dòng`
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
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Import Hoàn Tất!</h2>
          <div className="stats stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Từ mới</div>
              <div className="stat-value text-success">{result.inserted}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Từ cập nhật</div>
              <div className="stat-value text-info">{result.updated}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={handleReset}>
              Import thêm
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Xem Danh Sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
