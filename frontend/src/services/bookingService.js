import apiClient from './apiClient';

export const bookingService = {
  async createBooking(bookingData) {
    return apiClient.post('/bookings', bookingData);
  },

  async getFarmerBookings(farmerId) {
    return apiClient.get(`/bookings/farmer/${farmerId}`);
  },

  async getOwnerBookings(ownerId) {
    return apiClient.get(`/bookings/owner/${ownerId}`);
  },

  async confirmBooking(bookingId) {
    return apiClient.put(`/bookings/${bookingId}/confirm`);
  },

  async cancelBooking(bookingId) {
    return apiClient.put(`/bookings/${bookingId}/cancel`);
  },

  async completeBooking(bookingId) {
    return apiClient.put(`/bookings/${bookingId}/complete`);
  }
};
