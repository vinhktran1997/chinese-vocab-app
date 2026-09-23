import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGrammar, updateGrammar } from '../services/grammarService';
import GrammarForm from './GrammarForm';
import {
  grammarToFormData,
  validateGrammarForm,
} from '../utils/grammarFormUtils';
import { toast } from 'sonner';

export default function EditGrammar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrammar = async () => {
      try {
        const res = await getGrammar(id);
        setFormData(grammarToFormData(res.data));
      } catch {
        toast.error('Không thể tải dữ liệu!');
        navigate('/grammar');
      } finally {
        setFetching(false);
      }
    };
    fetchGrammar();
  }, [id, navigate]);

  const handleSubmit = async () => {
    const errorMsg = validateGrammarForm(formData);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await updateGrammar(id, formData);
      toast.success('Cập nhật thành công!');
      navigate(`/grammar/${id}`);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.message);
      } else {
        setError('Cập nhật thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-ghost"
          onClick={() => navigate(`/grammar/${id}`)}
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
          <span>Quay Lại</span>
        </button>
        <h1 className="text-2xl font-bold">Chỉnh Sửa Ngữ Pháp</h1>
      </div>

      <div className="card bg-base-100 shadow-md p-6">
        {formData && (
          <GrammarForm
            formData={formData}
            onChange={setFormData}
            error={error}
          />
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-ghost"
            onClick={() => navigate(`/grammar/${id}`)}
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
              'Lưu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
