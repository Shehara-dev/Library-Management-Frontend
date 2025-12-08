import api from './api';

export const reservationService = {
  createReservation: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  getUserReservations: async (userId) => {
    const response = await api.get(`/reservations/user/${userId}`);
    return response.data;
  },

  getAllReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  returnBook: async (reservationId) => {
    const response = await api.patch(`/reservations/${reservationId}/return`);
    return response.data;
  }
};