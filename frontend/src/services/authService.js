import apiClient from './apiClient';

export const authService = {
  async register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  async getProfile() {
    return apiClient.get('/auth/me');
  },

  async updateProfile(profileData) {
    return apiClient.put('/auth/profile', profileData);
  }
};
