import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
  getTeacherById: (id) => api.get(`/admin/teachers/${id}`),
  createTeacher: (data) => api.post('/admin/teachers', data),
  updateTeacher: (id, data) => api.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`)
};

export const classManagementService = {
  getAllClasses: () => api.get('/admin/classes'),
  getClassById: (id) => api.get(`/admin/classes/${id}`),
  createClass: (data) => api.post('/admin/classes', data),
  updateClass: (id, data) => api.put(`/admin/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`)
};

export const feeManagementService = {
  getAllTransactions: () => api.get('/admin/fees/transactions'),
  getTransactionById: (id) => api.get(`/admin/fees/transactions/${id}`),
  approveRefund: (id) => api.put(`/admin/fees/refunds/${id}/approve`),
  rejectRefund: (id) => api.put(`/admin/fees/refunds/${id}/reject`),
  approveDeposit: (id) => api.put(`/admin/fees/deposits/${id}/approve`),
  rejectDeposit: (id) => api.put(`/admin/fees/deposits/${id}/reject`)
};

export const studentManagementService = {
  getAllStudents: () => api.get('/admin/students'),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  addGrade: (studentId, data) => api.post(`/admin/students/${studentId}/grades`, data),
  addAttendance: (studentId, data) => api.post(`/admin/students/${studentId}/attendance`, data)
};

export default api;
