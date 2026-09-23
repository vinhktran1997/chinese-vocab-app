import { useState } from 'react';
import { updateWord } from '../services/wordService';
import WordForm from '../components/WordForm';
import {
  formDataToPayload,
  validateForm,
  wordToFormData,
} from '../utils/wordFormUtils.js';

export default function EditWord({ word, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(() => wordToFormData(word));
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
      await updateWord(word._id, formDataToPayload(formData));
      onSuccess();
    } catch {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Chỉnh Sửa Từ</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {formData && (
          <WordForm formData={formData} onChange={setFormData} error={error} />
        )}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
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
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
