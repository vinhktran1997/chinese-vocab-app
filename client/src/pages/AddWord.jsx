import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWord } from '../services/wordService';
import WordForm from '../components/WordForm';
import {
  emptyFormData,
  formDataToPayload,
  validateForm,
} from '../utils/wordFormUtils';
import { toast } from 'sonner';

export default function AddWord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const errorMsg = validateForm(formData);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await createWord(formDataToPayload(formData));
      toast.success('Thêm từ thành công!');
      setFormData(emptyFormData);
    } catch (error) {
      if (error.response?.status === 409) {
        setError(error.response.data.message);
      } else {
        setError('Thêm từ thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
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
        <h1 className="text-lg font-bold">Thêm Từ Mới</h1>
      </div>
      <div className="card bg-base-100 shadow-md p-6">
        <WordForm formData={formData} onChange={setFormData} error={error} />
        {/* Action */}
        <div className="flex justify-end gap-3 mt-2">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Thêm Từ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
