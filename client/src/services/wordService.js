import axios from 'axios';

const API = '/api/words';

export const getWords = (params) => axios.get(API, { params });
export const getWord = (id) => axios.get(`${API}/${id}`);
export const createWord = (data) => axios.post(API, data);
export const updateWord = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteWord = (id) => axios.delete(`${API}/${id}`);
export const importWords = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API}/import`, formData);
};
export const exportWords = (format, filters = {}) => {
  const params = new URLSearchParams({ format });
  if (filters.hskLevel) params.append('hskLevel', filters.hskLevel);
  if (filters.status) params.append('status', filters.status);
  if (filters.type) params.append('type', filters.type);

  window.open(`/api/words/export?${params.toString()}`, '_blank');
};
export const getReviewStats = (hskLevel, source) =>
  axios.get(`${API}/review/stats`, { params: { hskLevel, source } });

export const getReviewSession = (hskLevel, source, limit) =>
  axios.get(`${API}/review/session`, { params: { hskLevel, source, limit } });

export const completeReview = (remembered, forgotten) =>
  axios.post(`${API}/review/complete`, { remembered, forgotten });

export const resetReview = (hskLevel) =>
  axios.post(`${API}/review/reset`, { hskLevel });

export const toggleStatus = (id) => axios.patch(`${API}/${id}/status`);
