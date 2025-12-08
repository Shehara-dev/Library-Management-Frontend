export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083/api';

export const ROLES = {
  LIBRARIAN: 'LIBRARIAN',
  USER: 'USER'
};

export const BOOK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED'
};

export const RESERVATION_DAYS = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '21 Days', value: 21 }
];