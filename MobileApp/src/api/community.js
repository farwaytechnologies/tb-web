import api from './client';

export const getPosts = (page = 1) =>
  api.get(`/community?page=${page}`);

export const getPost = (id) => api.get(`/community/${id}`);

export const createPost = (data) => api.post('/community', data);

export const likePost = (id) => api.post(`/community/${id}/like`);

export const getComments = (postId) =>
  api.get(`/community/${postId}/comments`);

export const addComment = (postId, body) =>
  api.post(`/community/${postId}/comments`, { body });
