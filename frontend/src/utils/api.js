import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

// Admin APIs
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getDashboard: () => api.get('/admin/dashboard'),
  getStores: (params) => api.get('/admin/stores', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserById: (id) => api.get(`/admin/users/${id}`),
};

// User APIs
export const userAPI = {
  getStores: (params) => api.get('/user/stores', { params }),
  getRatings: () => api.get('/user/ratings'),
  rateStore: (storeId, rating) => api.post('/user/ratings', { storeId, rating }),
  updateRating: (storeId, rating) => api.put(`/user/ratings/${storeId}`, { rating }),
};

// Owner APIs
export const ownerAPI = {
  getDashboard: () => api.get('/owner/dashboard'),
};

export default api;
