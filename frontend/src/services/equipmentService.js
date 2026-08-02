import apiClient from './apiClient';

export const equipmentService = {
  async getAllEquipment(params = {}) {
    return apiClient.get('/equipment', { params });
  },

  async getEquipmentById(id) {
    return apiClient.get(`/equipment/${id}`);
  },

  async createEquipment(data) {
    // Check if sending FormData (multi-part for images) or JSON
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.post('/equipment', data, { headers });
  },

  async updateEquipment(id, data) {
    return apiClient.put(`/equipment/${id}`, data);
  },

  async deleteEquipment(id) {
    return apiClient.delete(`/equipment/${id}`);
  }
};
