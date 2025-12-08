import api from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  blacklistUser: async (userId) => {
    const response = await api.patch(`/users/${userId}/blacklist`);
    return response.data;
  },

  unblacklistUser: async (userId) => {
    const response = await api.patch(`/users/${userId}/unblacklist`);
    return response.data;
  }
};