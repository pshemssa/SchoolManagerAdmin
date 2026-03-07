import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAuthService = {
  login: (data) => api.post('/admin/login', data),
  logout: () => api.post('/admin/logout')
};

export const userManagementService = {
  getAllUsers: () => api.get('/admin/users'),
  getPendingVerifications: () => api.get('/admin/users/pending'),
  verifyUser: (userId) => api.put(`/admin/users/${userId}/verify`),
  rejectUser: (userId) => api.put(`/admin/users/${userId}/reject`)
};

export const dashboardService = {
  getStatistics: () => api.get('/admin/dashboard/statistics')
};

export const teacherManagementService = {
  getAllTeachers: () => api.get('/admin/teachers'),
  getTeacherById: (id) => api.get(`/admin/teachers/${id}`)
};

export const classManagementService = {
  getAllClasses: () => api.get('/admin/classes'),
  getClassById: (id) => api.get(`/admin/classes/${id}`)
};

export const feeManagementService = {
  getAllTransactions: () => api.get('/admin/fees/transactions'),
  getTransactionById: (id) => api.get(`/admin/fees/transactions/${id}`)
};

export default api;
