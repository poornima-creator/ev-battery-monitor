// frontend/src/utils/api.js

import axios from 'axios';

// Base URL from your .env file
const API_URL = import.meta.env.VITE_API_URL;

// Create an axios instance with the base URL preset
// So instead of writing the full URL every time,
// you just write api.post('/auth/login', ...)
const api = axios.create({
  baseURL: API_URL
});

// Interceptor: automatically adds the JWT token to every request
// So you never forget to send it manually
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ev_token');
  if (token) {
    // This is the format our backend auth middleware expects
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;