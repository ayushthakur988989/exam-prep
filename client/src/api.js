import axios from 'axios';

// Uses VITE_API_URL from .env in development, or falls back to the production URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://exam-prep-1v8x.onrender.com';

// Create a configured axios instance with the right base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
