import apiClient from './apiClient';

export const weatherService = {
  async getForecast(params = {}) {
    return apiClient.get('/weather/forecast', { params });
  },

  async getCropAdvisory(params = {}) {
    return apiClient.get('/weather/advisory', { params });
  },

  async getCropCalendar(params = {}) {
    return apiClient.get('/weather/calendar', { params });
  }
};
