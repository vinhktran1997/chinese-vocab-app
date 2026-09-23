import axios from 'axios';

const API = '/api/grammar';

export const getGrammars = (params) => axios.get(API, { params });
export const getGrammarIds = (params) => axios.get(`${API}/ids`, { params });
export const getGrammar = (id) => axios.get(`${API}/${id}`);
export const createGrammar = (data) => axios.post(API, data);
export const updateGrammar = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteGrammar = (id) => axios.delete(`${API}/${id}`);
export const toggleGrammarStatus = (id) => axios.patch(`${API}/${id}/status`);
export const getGrammarReviewStats = (hskLevel) =>
  axios.get(`${API}/review/stats`, { params: { hskLevel } });
export const getGrammarReviewSession = (hskLevel, limit) =>
  axios.get(`${API}/review/session`, { params: { hskLevel, limit } });
export const completeGrammarReview = (remembered, forgotten) =>
  axios.post(`${API}/review/complete`, { remembered, forgotten });
export const resetGrammarReview = (hskLevel) =>
  axios.post(`${API}/review/reset`, { hskLevel });
export const importGrammars = (data) => axios.post(`${API}/import`, data);
