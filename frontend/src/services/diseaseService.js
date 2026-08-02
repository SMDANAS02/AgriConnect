import apiClient from './apiClient';

export const diseaseService = {
  async detectDisease(data) {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.post('/disease/detect', data, { headers });
  },

  async getDetectionHistory(params = {}) {
    return apiClient.get('/disease/history', { params });
  },

  async getCropDiseases(params = {}) {
    return apiClient.get('/diseases', { params });
  }
};
