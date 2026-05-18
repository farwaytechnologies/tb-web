import api from './client';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (data) =>
  api.post('/auth/register', data);

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

export const updateProfile = (id, data) =>
  api.put(`/auth/update/${id}`, data);

export const changePassword = (data) =>
  api.post('/auth/change-password', data);
