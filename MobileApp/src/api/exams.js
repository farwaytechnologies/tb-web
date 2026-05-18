import api from './client';

export const getExams = () => api.get('/exams');
export const getExam = (id) => api.get(`/exams/${id}`);
export const submitExam = (id, data) => api.post(`/exams/${id}/submit`, data);
