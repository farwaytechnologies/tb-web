import api from './client';

export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id, userId) =>
  api.post(`/notifications/${id}/read`, { userId });

export const getJobs = () => api.get('/jobs');
export const applyJob = (data) => api.post('/applications', data);

export const getBlogs = () => api.get('/blogs');
export const getBlog = (id) => api.get(`/blogs/${id}`);

export const getNews = () => api.get('/news');

export const getRewards = (userId) =>
  api.get(`/student-rewards/${userId}`);

export const createPaymentOrder = (courseId) =>
  api.post('/payment/create-order', { courseId });

export const verifyPayment = (data) =>
  api.post('/payment/verify', data);
