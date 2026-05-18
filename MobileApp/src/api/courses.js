import api from './client';

export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);

export const getEnrollments = (userId) =>
  api.get(`/enrollments/user/${userId}`);

export const enroll = (data) => api.post('/enrollments', data);

export const getProgress = (userId, courseId) =>
  api.get(`/progress?userId=${userId}&courseId=${courseId}`);

export const markLessonComplete = (progressId, lessonKey) =>
  api.patch(`/progress/${progressId}/complete`, { lessonKey });

export const getCertificates = (userId) =>
  api.get(`/enrollments/certificates/${userId}`);
