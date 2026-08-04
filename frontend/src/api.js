import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add openrouter key header if user saved it
    const openrouterKey = localStorage.getItem('openrouter_key');
    if (openrouterKey) {
      config.headers['X-Openrouter-Api-Key'] = openrouterKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
