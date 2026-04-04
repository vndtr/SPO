import api from './api';

export const getAnnotations = async (bookId) => {
  const response = await api.get(`/annotations/?book_id=${bookId}`);
  return response.data;
};

export const createAnnotation = async (annotationData) => {
  const response = await api.post('/annotations/', annotationData);
  return response.data;
};

export const deleteAnnotation = async (annotationId) => {
  const response = await api.delete(`/annotations/${annotationId}`);
  return response.data;
};

export const updateAnnotation = async (annotationId, updates) => {
  const response = await api.put(`/annotations/${annotationId}`, updates);
  return response.data;
};