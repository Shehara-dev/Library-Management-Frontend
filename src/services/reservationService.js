import api from './api';

export const reservationService = {
  createReservation: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  getUserReservations: async (userId) => {
    
    if (!userId) {
      console.warn("getUserReservations called without a valid userId."); 
      return []; 
    }

   
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