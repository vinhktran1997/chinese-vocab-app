import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGrammar } from '../services/grammarService';
import GrammarForm from '../components/GrammarForm';
import { toast } from 'sonner';
import { emptyFormData, validateGrammarForm } from '../utils/grammarFormUtils';

export default function AddGrammar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const errorMsg = validateGrammarForm(formData);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await createGrammar(formData);
      toast.success('Thêm ngữ pháp thành công!');
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.message);
      } else {
        setError('Thêm ngữ pháp thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <button className="btn btn-ghost" onClick={() => navigate('/grammar')}>
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
          <span>Quay Lại</span>
        </button>
        <h1 className="text-2xl font-bold">Thêm Ngữ Pháp Mới</h1>
      </div>

      <div className="card bg-base-100 shadow-md p-6">
        <GrammarForm formData={formData} onChange={setFormData} error={error} />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/grammar')}
          >
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Thêm Ngữ Pháp'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
