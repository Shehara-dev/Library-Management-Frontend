import api from './api';

export const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  filterBooks: async (filters) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.language) params.append('language', filters.language);
    
    const response = await api.get(`/books/filter?${params.toString()}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  uploadBookImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/books/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateBookStatus: async (id, status) => {
    const response = await api.patch(`/books/${id}/status?status=${status}`);
    return response.data;
  }
};